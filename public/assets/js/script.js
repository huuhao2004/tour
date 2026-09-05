// Box address - section 1
const boxAddressSection1 = document.querySelector(
  ".section-1 .inner-form .inner-box",
);
if (boxAddressSection1) {
  const input = boxAddressSection1.querySelector(".inner-input");
  input.addEventListener("focus", () => {
    boxAddressSection1.classList.add("active");
  });

  input.addEventListener("blur", () => {
    boxAddressSection1.classList.remove("active");
  });

  const listItem = boxAddressSection1.querySelectorAll(
    ".inner-success-list .inner-item",
  );
  listItem.forEach((item) => {
    item.addEventListener("mousedown", () => {
      const title = item.querySelector(".inner-item-title").innerHTML.trim();
      input.value = title;
    });
  });
}
// End Box address - section 1

// Box user section 1
const boxUserSection1 = document.querySelector(
  ".section-1 .inner-form .inner-user",
);
if (boxUserSection1) {
  const input = boxUserSection1.querySelector(".inner-input");
  input.addEventListener("focus", () => {
    boxUserSection1.classList.add("active");
  });
  document.addEventListener("click", (e) => {
    if (!boxUserSection1.contains(e.target)) {
      boxUserSection1.classList.remove("active");
    }
  });

  //Thêm số lượng vào ô input
  const updateQuantityInput = () => {
    const listBoxNumber = boxUserSection1.querySelectorAll(
      ".inner-count .inner-number",
    );
    const listNumber = [];
    listBoxNumber.forEach((boxNumber) => {
      const number = parseInt(boxNumber.innerHTML);
      listNumber.push(number);
    });
    const value = `NL: ${listNumber[0]}, TE: ${listNumber[1]}, EB: ${listNumber[2]},`;
    input.value = value;
  };

  //up
  const listButtonUp = boxUserSection1.querySelectorAll(".inner-up");
  listButtonUp.forEach((item) => {
    item.addEventListener("click", () => {
      const parent = item.parentElement;
      const boxNumber = parent.querySelector(".inner-number");
      const number = parseInt(boxNumber.innerHTML);
      const numberUpdate = number + 1;
      boxNumber.innerHTML = numberUpdate;
      updateQuantityInput();
    });
  });

  //down
  const listButtonDown = boxUserSection1.querySelectorAll(".inner-down");
  listButtonDown.forEach((item) => {
    item.addEventListener("click", () => {
      const parent = item.parentElement;
      const boxNumber = parent.querySelector(".inner-number");
      const number = parseInt(boxNumber.innerHTML);
      if (number > 0) {
        const numberUpdate = number - 1;
        boxNumber.innerHTML = numberUpdate;
        updateQuantityInput();
      }
    });
  });
}
// End box user section 1

// Clock expire section 2
const clockExpire = document.querySelector("[clock-expire]");
if (clockExpire) {
  const expireDateTimeString = clockExpire.getAttribute("clock-expire");
  //chuyen sang dang date
  const expireDateTime = new Date(expireDateTimeString);

  const updateClock = () => {
    const now = new Date();
    const remainingTime = expireDateTime - now; // mili s
    if (remainingTime > 0) {
      const days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
      const hours = Math.floor((remainingTime / (60 * 60 * 1000)) % 24);
      const minutes = Math.floor((remainingTime / (60 * 1000)) % 60);
      const seconds = Math.floor((remainingTime / 1000) % 60);

      const listBoxNumber = clockExpire.querySelectorAll(".inner-number");

      listBoxNumber[0].innerHTML = `${days}`.padStart(2, "0");
      listBoxNumber[1].innerHTML = `${hours}`.padStart(2, "0");
      listBoxNumber[2].innerHTML = `${minutes}`.padStart(2, "0");
      listBoxNumber[3].innerHTML = `${seconds}`.padStart(2, "0");
    } else {
      clearInterval(intervalClock);
    }
  };

  const intervalClock = setInterval(updateClock, 1000);
}
// Clock expire section 2

// Box tour info
const boxTourInfo = document.querySelector(".box-tour-info");
if (boxTourInfo) {
  const buttonReadMore = boxTourInfo.querySelector(".inner-read-more button");
  buttonReadMore.addEventListener("click", () => {
    if (boxTourInfo.classList.contains("active")) {
      boxTourInfo.classList.remove("active");
      buttonReadMore.innerHTML = "Xem tất cả";
    } else {
      boxTourInfo.classList.add("active");
      buttonReadMore.innerHTML = "Ẩn bớt";
    }
  });
}
// End box tour info

// Khởi tạo AOS
AOS.init();

// Swiper Section 2
const swiperSection2 = document.querySelector(".swiper-section-2");

if (swiperSection2) {
  new Swiper(".swiper-section-2", {
    slidesPerView: 3,
    spaceBetween: 20,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    loop: true,
  });
}

// End Swiper Section 2

// Swiper Section 3
const swiperSection3 = document.querySelector(".swiper-section-3");

if (swiperSection3) {
  new Swiper(".swiper-section-3", {
    slidesPerView: 3,
    spaceBetween: 20,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

// End Swiper Section 3

// Swipper box image section 10
const boxImages = document.querySelector(".box-images");
if (boxImages) {
  const swiperBoxImagesThumb = new Swiper(".swiper-box-images-thumb", {
    spaceBetween: 10,
    slidesPerView: 4,
  });
  const swiperBoxImagesMain = new Swiper(".swiper-box-images-main", {
    spaceBetween: 10,
    thumbs: {
      swiper: swiperBoxImagesThumb,
    },
  });
}
// End Swipper box image section 10

// Zoom Box Images Main
const boxImagesMain = document.querySelector(".box-images .inner-images-main");
if (boxImagesMain) {
  const viewer = new Viewer(boxImagesMain);
}
//End Zoom Box Images Main

// Email form
const emailForm = document.querySelector("#email-form");
if (emailForm) {
  const validator = new JustValidate("#email-form");
  validator
    .addField("#email-input", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email của bạn!",
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!",
      },
    ])
    .onSuccess((event) => {
      const email = event.target.email.value;
      
      const dataFinal = {
        email
      };

      const fetchApi = async () => {
        const response = await fetch("/contact/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dataFinal)
        });
        const result = await response.json();
        if (result.code == "error") {
          alert(result.message);
        } else if(result.code == "success") {
          window.location.reload();
        }
      }
      fetchApi();
    });
}
// End email form

// Coupon form
const couponForm = document.querySelector("#coupon-form");
if (couponForm) {
  const validator = new JustValidate("#coupon-form");
  validator
    .addField("#coupon-input", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mã giảm giá!",
      },
    ])
    .onSuccess((event) => {
      const email = event.target.coupon.value;
    });
}
// End Coupon form

// Order form
const orderForm = document.querySelector("#order-form");
if (orderForm) {
  const validator = new JustValidate("#order-form");
  validator
    .addField("#full-name-input", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập họ tên!",
      },
      {
        rule: "minLength",
        value: 5,
        errorMessage: "Họ tên phải có ít nhất 5 kí tự!",
      },
      {
        rule: "maxLength",
        value: 50,
        errorMessage: "Họ tên không được vượt quá 50 kí tự!",
      },
    ])
    .addField("#phone-input", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập số điện thoại!",
      },
      {
        rule: "customRegexp",
        value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
        errorMessage: "Số điện thoại không đúng định dạng!",
      },
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value;
      const phone = event.target.phone.value;
      const method = event.target.method.value;
      console.log(method);
    });

  // List input method
  const listInputMedthod = orderForm.querySelectorAll('input[name="method"]');
  const elementInfoBank = orderForm.querySelector(".inner-info-bank");
  listInputMedthod.forEach((item) => {
    item.addEventListener("change", () => {
      if (item.value === "bank") {
        elementInfoBank.classList.add("active");
      } else {
        elementInfoBank.classList.remove("active");
      }
    });
  });
}
// End Order form

// Alert
const alertTime = document.querySelector("[alert-time]");
if (alertTime) {
  let time = alertTime.getAttribute("alert-time");
  time = time ? parseInt(time) : 4000;
  setTimeout(() => {
    alertTime.remove();
  }, time)
}
// End alert

// box filter
const boxFilter = document.querySelector(".box-filter");
if (boxFilter) {
  const url = new URL(`${window.location.origin}/search`);

  const buttonApply = boxFilter.querySelector(".inner-button");
  buttonApply.addEventListener("click", () => {
    const filterList = [
      "locationFrom",
      "locationTo",
      "departureDate",
      "stockAdult",
      "stockChildren",
      "stockBaby",
      "price"
    ]

    filterList.forEach(item => {
      const value = boxFilter.querySelector(`[name="${item}"]`).value;
      if (value) {
        url.searchParams.set(item, value);
      } else {
        url.searchParams.delete(item);
      }
    });

    window.location.href = url.href;
  })
}
// End box filter

// Form search home
const formSearch = document.querySelector("[form-search]");
if (formSearch) {
  const url = new URL(`${window.location.origin}/search`);
  formSearch.addEventListener("submit", (event) => {
    event.preventDefault();

    //Điểm đến
    const locationTo = formSearch.locationTo.value;
    if (locationTo) {
      url.searchParams.set("locationTo", locationTo);
    }else {
      url.searchParams.delete("locationTo");
    }
    // Số lượng
    const stockAdult = parseInt(formSearch.querySelector("[stock-adult]").innerHTML);
    if (stockAdult > 0) {
      url.searchParams.set("stockAdult", stockAdult);
    } else {
      url.searchParams.delete("stockAdult");
    }

    const stockChildren = parseInt(formSearch.querySelector("[stock-children]").innerHTML);
    if (stockChildren > 0) {
      url.searchParams.set("stockChildren", stockChildren);
    } else {
      url.searchParams.delete("stockChildren");
    }

    const stockBaby = parseInt(formSearch.querySelector("[stock-baby]").innerHTML);
    if (stockBaby > 0) {
      url.searchParams.set("stockBaby", stockBaby);
    } else {
      url.searchParams.delete("stockBaby");
    }
    // Ngày khởi hành
    const depatureDate = formSearch.depatureDate.value;
    if (depatureDate) {
      url.searchParams.set("depatureDate", depatureDate);
    } else {
      url.searchParams.delete("depatureDate");
    }

    window.location.href = url.href;
  })
}
// End form search home


// box-tour-detail
const boxTourDetail = document.querySelector(".box-tour-detail");
if (boxTourDetail) {
  const inputStockAdult = boxTourDetail.querySelector("[input-stock-adult]");
  const inputStockChildren = boxTourDetail.querySelector("[input-stock-children]");
  const inputStockBaby = boxTourDetail.querySelector("[input-stock-baby]");

  const drawBoxDetail = () => {
    const quantityAdult = parseInt(inputStockAdult.value);
    const quantityChildren = parseInt(inputStockChildren.value);
    const quantityBaby = parseInt(inputStockBaby.value);

    const stockAdult = boxTourDetail.querySelector("[stock-adult]");
    const stockChildren = boxTourDetail.querySelector("[stock-children]");
    const stockBaby = boxTourDetail.querySelector("[stock-baby]");

    stockAdult.innerHTML = quantityAdult;
    stockChildren.innerHTML = quantityChildren;
    stockBaby.innerHTML = quantityBaby;

    const priceAdult = parseInt(inputStockAdult.getAttribute("price"));
    const priceChildren = parseInt(inputStockChildren.getAttribute("price"));
    const priceBaby = parseInt(inputStockBaby.getAttribute("price"));

    const totalPrice = priceAdult * quantityAdult + priceChildren * quantityChildren + priceBaby * quantityBaby;

    const elementTotalPrice = boxTourDetail.querySelector("[total-price]")
    elementTotalPrice.innerHTML = totalPrice.toLocaleString("vi-VN");
  }

  inputStockAdult.addEventListener("change", drawBoxDetail);
  inputStockChildren.addEventListener("change", drawBoxDetail);
  inputStockBaby.addEventListener("change", drawBoxDetail);

  const buttonAddToCart = boxTourDetail.querySelector(".inner-button-add-cart");
  buttonAddToCart.addEventListener("click", () => {
    const tourId = buttonAddToCart.getAttribute("tour-id");
    const quantityAdult = parseInt(inputStockAdult.value);
    const quantityChildren = parseInt(inputStockChildren.value);
    const quantityBaby = parseInt(inputStockBaby.value);
    const locationFrom = boxTourDetail.querySelector("[location-from]").value;

    if (quantityAdult > 0 || quantityChildren > 0 || quantityBaby > 0) {
      const cartItem = {
        tourId,
        quantityAdult,
        quantityChildren,
        quantityBaby,
        locationFrom
      };
      const cart = JSON.parse(localStorage.getItem("cart"));
      const indexItemExits = cart.findIndex(item => item.tourId == tourId);
      // tra ve -1 la k tim thay
      if (indexItemExits != -1) {
        cart[indexItemExits] = cartItem;
      } else {
        cart.push(cartItem);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      window.location.href = "/cart";
    }
  })
}
// end box-tour-detail

//initial cart
const cart = localStorage.getItem("cart");
if (!cart) {
  localStorage.setItem("cart", JSON.stringify([]));
  //localStorage chỉ lưu đc dưới dạng chuôi, lưu đc mảng => cần chuyển mạng sang json
}
//end initial cart

//mini cart
const miniCart = document.querySelector("[mini-cart]");
if (miniCart) {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const quantityCart = cart.length;

  miniCart.innerHTML = quantityCart;
}
//end mini cart