/**
 * Hướng của menu swipe: 'left' (trái), 'right' (phải), hoặc 'both' (cả hai).
 */
export type SwipeMenuDirection = 'left' | 'right' | 'both';

/**
 * Tùy chọn cấu hình cho action swipeMenu.
 */
export type SwipeMenuOptions = {
	/** Hướng menu được hỗ trợ (mặc định: 'right'). */
	direction?: SwipeMenuDirection;
	/** Tỷ lệ chiều rộng của mỗi item menu so với container (mặc định: 0.25). */
	menuItemRatio?: number;
	/** Chiều rộng cố định của mỗi item menu tính bằng px (ghi đè menuItemRatio). */
	menuItemWidthPx?: number;
	/** Số lượng item menu bên trái (dùng để tính chiều rộng). */
	leftMenuItems?: number;
	/** Số lượng item menu bên phải (dùng để tính chiều rộng). */
	rightMenuItems?: number;
	/** Khoảng di chuyển tối thiểu (px) trước khi khóa trục (mặc định: 6). */
	axisLockThresholdPx?: number;
	/** Tỷ lệ chiều rộng bên cần thiết để snap mở (mặc định: 0.5). */
	snapOpenRatio?: number;
	/**
	 * Tỷ lệ chiều rộng bên cần thiết để snap đóng khi menu đang mở (mặc định: 0.5).
	 * Ví dụ: 0.3 nghĩa là chỉ cần kéo ngược lại 30% chiều rộng menu là sẽ đóng.
	 */
	snapCloseRatio?: number;
	/** Thời gian chuyển tiếp cho việc snap tính bằng ms (mặc định: 160). */
	snapMs?: number;
	/** Easing cho chuyển tiếp snap (mặc định: 'ease'). */
	snapEasing?: string;
	/** Khi true, vô hiệu hóa hoàn toàn việc swipe. */
	disabled?: boolean;
	/** CSS selector cho container menu bên trái bên trong node. */
	leftMenuSelector?: string;
	/** CSS selector cho container menu bên phải bên trong node. */
	rightMenuSelector?: string;
	/** CSS selector cho element content bên trong node. */
	contentSelector?: string;
	/**
	 * Ngăn điều hướng link sau khi swipe hoặc khi menu đang mở (mặc định: true).
	 * Hữu ích khi content là <a>.
	 */
	preventNavigateOnSwipe?: boolean;
	/** Bắt đầu ở trạng thái mở (mặc định: false). */
	initialOpen?: boolean;
};

/**
 * Action Svelte để tạo menu swipe cho các element.
 * Cho phép người dùng swipe trái/phải để hiển thị menu ẩn.
 *
 * @param options - Tùy chọn cấu hình cho menu swipe
 * @returns Hàm action Svelte
 *
 * Cách sử dụng:
 * <div use:swipeMenu={{ direction: 'both', leftMenuItems: 2, rightMenuItems: 1 }}>
 *   <div data-swipe-menu-left>...</div>
 *   <div data-swipe-content>...</div>
 *   <div data-swipe-menu-right>...</div>
 * </div>
 */
export function swipeMenu(options: SwipeMenuOptions = {}) {
	return (node: HTMLElement) => {
		// Giải nén các tùy chọn với giá trị mặc định
		const {
			direction = 'right',
			menuItemRatio = 0.25,
			menuItemWidthPx,
			leftMenuItems,
			rightMenuItems,
			axisLockThresholdPx = 5,
			snapOpenRatio = 0.2,
			snapCloseRatio = 0.2,
			snapMs = 120,
			snapEasing = 'ease',
			disabled = false,
			leftMenuSelector = '[data-swipe-menu-left]',
			rightMenuSelector = '[data-swipe-menu-right]',
			contentSelector = '[data-swipe-content]',
			preventNavigateOnSwipe = true,
			initialOpen = false
		} = options;

		// Tìm các element menu và content
		const leftMenuEl = node.querySelector(leftMenuSelector) as HTMLElement | null;
		const rightMenuEl = node.querySelector(rightMenuSelector) as HTMLElement | null;
		const contentEl = node.querySelector(contentSelector) as HTMLElement | null;
		if (!contentEl) return; // Nếu không tìm thấy content element, thoát

		// Biến trạng thái cho việc swipe
		let offsetX = 0; // Độ dịch chuyển ngang: + => hiển thị menu trái, - => hiển thị menu phải
		let startX = 0; // Tọa độ X bắt đầu touch
		let startY = 0; // Tọa độ Y bắt đầu touch
		let startOffsetX = 0; // offsetX ban đầu khi bắt đầu drag
		let dragging = false; // Đang drag hay không
		let axisLocked: 'x' | 'y' | null = null; // Trục đã bị khóa ('x' hoặc 'y')
		let didSwipe = false; // Đã thực hiện swipe hay chưa

		// Hàm clamp để giới hạn giá trị trong khoảng min-max
		const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

		// Tính chiều rộng của mỗi item menu
		const itemWidth = () => {
			if (
				typeof menuItemWidthPx === 'number' &&
				Number.isFinite(menuItemWidthPx) &&
				menuItemWidthPx >= 0
			) {
				return menuItemWidthPx; // Sử dụng chiều rộng cố định nếu được chỉ định
			}
			const w = node.getBoundingClientRect().width * menuItemRatio; // Tính theo tỷ lệ
			return Number.isFinite(w) ? Math.max(0, w) : 0;
		};

		// Áp dụng kích thước cho menu trái và phải
		const applyMenuSizing = () => {
			const iw = itemWidth();

			// Hàm áp dụng kích thước cho một bên menu
			const applySide = (el: HTMLElement | null, w: number) => {
				if (!el) return;
				el.style.width = `${w}px`;
				const children = Array.from(el.children) as HTMLElement[];
				for (const child of children) {
					child.style.width = `${iw}px`; // Đặt chiều rộng cho mỗi button
					child.style.flex = '0 0 auto'; // Đảm bảo không co giãn
				}
			};

			applySide(leftMenuEl, leftWidth());
			applySide(rightMenuEl, rightWidth());
		};

		// Tính chiều rộng menu từ số lượng item hoặc đo thực tế
		const widthFromCountOrMeasure = (el: HTMLElement | null, count: number | undefined) => {
			const c =
				typeof count === 'number' && Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
			if (c > 0) return c * itemWidth(); // Tính từ số lượng item
			if (el) {
				const w = el.getBoundingClientRect().width;
				if (Number.isFinite(w) && w > 0) return w; // Đo thực tế nếu có element
			}
			return 0;
		};

		// Chiều rộng của menu trái
		const leftWidth = () => {
			if (direction === 'right') return 0; // Không có menu trái nếu chỉ hỗ trợ phải
			return widthFromCountOrMeasure(leftMenuEl, leftMenuItems);
		};

		// Chiều rộng của menu phải
		const rightWidth = () => {
			if (direction === 'left') return 0; // Không có menu phải nếu chỉ hỗ trợ trái
			return widthFromCountOrMeasure(rightMenuEl, rightMenuItems);
		};

		// Thiết lập transition cho các element
		const setTransition = (enabled: boolean) => {
			const value = enabled ? `transform ${snapMs}ms ${snapEasing}` : 'none';
			leftMenuEl && (leftMenuEl.style.transition = value);
			rightMenuEl && (rightMenuEl.style.transition = value);
			contentEl.style.transition = value;
		};

		// Áp dụng vị trí transform cho các element
		const apply = (nextOffsetX: number) => {
			const lw = leftWidth();
			const rw = rightWidth();
			offsetX = clamp(nextOffsetX, -rw, lw); // Giới hạn offset trong phạm vi menu

			contentEl.style.transform = `translateX(${offsetX}px)`; // Dịch chuyển content

			if (leftMenuEl) {
				leftMenuEl.style.transform = `translateX(${-lw + offsetX}px)`; // Menu trái dịch ngược
			}
			if (rightMenuEl) {
				rightMenuEl.style.transform = `translateX(${rw + offsetX}px)`; // Menu phải dịch cùng chiều
			}
		};

		// Thiết lập style ban đầu cho các element
		node.style.touchAction = 'pan-y'; // Cho phép scroll dọc
		contentEl.style.touchAction = 'pan-y';
		contentEl.style.userSelect = 'none'; // Ngăn chặn text selection
		leftMenuEl && (leftMenuEl.style.willChange = 'transform'); // Tối ưu hiệu suất
		rightMenuEl && (rightMenuEl.style.willChange = 'transform');
		contentEl.style.willChange = 'transform';
		setTransition(false); // Tắt transition ban đầu
		applyMenuSizing(); // Thiết lập kích thước menu
		if (initialOpen) {
			apply(direction === 'left' ? leftWidth() : direction === 'right' ? -rightWidth() : 0);
		} else {
			apply(0); // Bắt đầu ở vị trí đóng
		}

		// Xử lý việc "settle" (đóng/mở menu) sau khi kết thúc touch
		const settle = () => {
			const lw = leftWidth();
			const rw = rightWidth();
			setTransition(true); // Bật transition để có hiệu ứng mượt

			const isLeftOpen = startOffsetX > 0; // Menu trái đang mở trước khi drag
			const isRightOpen = startOffsetX < 0; // Menu phải đang mở trước khi drag

			if (offsetX > 0) {
				if (isLeftOpen) {
					// Menu trái đang mở: đóng nếu đã kéo ngược lại đủ snapCloseRatio
					apply(offsetX < lw * (1 - snapCloseRatio) ? 0 : lw);
				} else {
					// Menu trái đang đóng: mở nếu đã kéo đủ snapOpenRatio
					apply(offsetX > lw * snapOpenRatio ? lw : 0);
				}
			} else if (offsetX < 0) {
				if (isRightOpen) {
					// Menu phải đang mở: đóng nếu đã kéo ngược lại đủ snapCloseRatio
					apply(Math.abs(offsetX) < rw * (1 - snapCloseRatio) ? 0 : -rw);
				} else {
					// Menu phải đang đóng: mở nếu đã kéo đủ snapOpenRatio
					apply(Math.abs(offsetX) > rw * snapOpenRatio ? -rw : 0);
				}
			} else {
				apply(0); // Đóng menu
			}

			window.setTimeout(() => setTransition(false), snapMs + 10); // Tắt transition sau khi hoàn thành
		};

		// Lấy touch đầu tiên từ event
		const getTouch = (e: TouchEvent) => e.touches[0] ?? e.changedTouches[0] ?? null;

		// Xử lý sự kiện touch bắt đầu
		const onTouchStart = (e: TouchEvent) => {
			if (disabled) return; // Vô hiệu hóa nếu được thiết lập
			const t = getTouch(e);
			if (!t) return;
			dragging = true;
			startX = t.clientX;
			startY = t.clientY;
			startOffsetX = offsetX;
			axisLocked = null; // Reset trạng thái khóa trục
			didSwipe = false; // Reset trạng thái swipe
			setTransition(false); // Tắt transition trong lúc drag
		};

		// Xử lý sự kiện touch di chuyển
		const onTouchMove = (e: TouchEvent) => {
			if (!dragging) return;
			const t = getTouch(e);
			if (!t) return;

			const dx = t.clientX - startX; // Độ dịch chuyển ngang
			const dy = t.clientY - startY; // Độ dịch chuyển dọc

			// Xác định trục di chuyển nếu chưa khóa
			if (axisLocked === null) {
				if (Math.abs(dx) < axisLockThresholdPx && Math.abs(dy) < axisLockThresholdPx) return; // Chưa đủ ngưỡng
				axisLocked = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'; // Khóa trục dựa trên hướng di chuyển lớn hơn
			}
			if (axisLocked === 'y') return; // Bỏ qua nếu đang scroll dọc

			didSwipe = true; // Đánh dấu đã thực hiện swipe
			e.preventDefault(); // Ngăn chặn scroll mặc định
			apply(startOffsetX + dx); // Áp dụng vị trí mới
		};

		// Xử lý sự kiện touch kết thúc
		const onTouchEnd = () => {
			if (!dragging) return;
			dragging = false;
			axisLocked = null; // Reset trạng thái khóa trục
			settle(); // Xử lý đóng/mở menu
		};

		// Xử lý click trên content để ngăn điều hướng nếu cần
		const onContentClick = (e: MouseEvent) => {
			if (!preventNavigateOnSwipe) return;
			// Nếu người dùng vừa swipe (hoặc menu đang mở), không điều hướng
			if (didSwipe || offsetX !== 0) {
				e.preventDefault();
				e.stopPropagation();
			}
		};

		// Đăng ký các event listener
		node.addEventListener('touchstart', onTouchStart, { passive: true });
		node.addEventListener('touchmove', onTouchMove, { passive: false }); // Không passive vì có preventDefault
		node.addEventListener('touchend', onTouchEnd);
		node.addEventListener('touchcancel', onTouchEnd);
		contentEl.addEventListener('click', onContentClick, true); // Capture phase

		// Theo dõi thay đổi kích thước container để cập nhật menu
		const ro = new ResizeObserver(() => {
			const prev = offsetX;
			applyMenuSizing(); // Cập nhật kích thước menu
			// Giữ menu mở theo tỷ lệ khi resize
			apply(prev);
		});
		ro.observe(node);

		// Hàm cleanup khi component bị destroy
		return () => {
			node.removeEventListener('touchstart', onTouchStart);
			node.removeEventListener('touchmove', onTouchMove);
			node.removeEventListener('touchend', onTouchEnd);
			node.removeEventListener('touchcancel', onTouchEnd);
			contentEl.removeEventListener('click', onContentClick, true);
			ro.disconnect(); // Ngừng theo dõi resize
		};
	};
}
