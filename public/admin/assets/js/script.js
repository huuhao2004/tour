// Schedule section 8
const scheduleSection8 = document.querySelector(".section-8 .inner-schedule");
if (scheduleSection8) {
  const buttonCreate = scheduleSection8.querySelector(".inner-schedule-create");
  const listItem = scheduleSection8.querySelector(".inner-schedule-list");

  // Tạo mới
  buttonCreate.addEventListener("click", () => {
    const fisrtItem = listItem.querySelector(".inner-schedule-item");
    const cloneItem = fisrtItem.cloneNode(true);
    //reset gia tri o input
    cloneItem.querySelector(".inner-schedule-head input").value = "";
    const body = cloneItem.querySelector(".inner-schedule-body");
    const id = `mce_${Date.now()}`;
    body.innerHTML = `<textarea textarea-mce id=${id}></textarea>`;

    listItem.append(cloneItem);
    initTinyMCE(`#${id}`);
  });

  // // Xóa / Mở (Sử dụng Event Delegation)
  listItem.addEventListener("click", (event) => {
    //Ẩn
    const buttonMore = event.target.closest(".inner-more");
    if (buttonMore) {
      const currentItem = buttonMore.closest(".inner-schedule-item");
      currentItem.classList.toggle("hidden");
    }

    // 2. Xử lý tính năng XÓA
    const buttonRemove = event.target.closest(".inner-remove");
    if (buttonRemove) {
      const currentItem = buttonRemove.closest(".inner-schedule-item");

      // Ngăn không cho người dùng xóa nếu chỉ còn 1 item duy nhất
      const allItems = listItem.querySelectorAll(".inner-schedule-item");
      if (allItems.length > 1) {
        currentItem.remove();
      } else {
        alert("Không thể xóa lịch trình cuối cùng!");
      }
    }
  });

  // Di chuyển thứ tự
  new Sortable(listItem, {
    handle: ".inner-move",
    animation: 150,

    // 1. Chạy khi người dùng bắt đầu nhấn giữ chuột và kéo item đi
    onStart: function (event) {
      // Tìm các textarea chứa TinyMCE trong item đang được kéo
      const textarea = event.item.querySelector("[textarea-mce]");

      const id = textarea.id;
      tinymce.get(id).remove();
    },

    // 2. Chạy khi người dùng thả chuột ra (kết thúc quá trình kéo thả và chốt vị trí mới)
    onEnd: function (event) {
      // Tìm các textarea chứa TinyMCE trong item đang được kéo
      const textarea = event.item.querySelector("[textarea-mce]");

      const id = textarea.id;
      initTinyMCE(`#${id}`);
    },
  });
}
// End schedule section 8

// Filepond image
const listFilepondImage = document.querySelectorAll("[filepond-image]");
const filePond = {}
if (listFilepondImage.length > 0) {
  listFilepondImage.forEach(item => {
    FilePond.registerPlugin(
      FilePondPluginImagePreview,
      FilePondPluginFileValidateType,
    );
    filePond[item.name] = FilePond.create(item, {
      labelIdle: "+",
      imagePreviewHeight: 150,
      stylePanelLayout: "compact",
    });
  })
}
// End filepond image


// Biểu đồ doanh thu
const revenueChart = document.querySelector("#revenue-chart");
if (revenueChart) {
  new Chart(revenueChart, {
    type: "line",
    data: {
      labels: ["01", "02", "03", "04", "05"],
      datasets: [
        {
          label: "Tháng 6",
          data: [1200, 1399, 12000, 1702, 1111],
          borderColor: "#36A1EA",
          boderWidth: 1.5,
        },
        {
          label: "Tháng 5",
          data: [1000, 1121, 9000, 2017, 2011],
          borderColor: "#FE6383",
          boderWidth: 1.5,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: "bottom",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Ngày",
          },
        },
        y: {
          title: {
            display: true,
            text: "Doanh thu (VND)",
          },
        },
      },
      maintainAspectRatio: false
    },
  });
}
// End biểu đồ doanh thu


// Category Create Form
const categoryCreateForm = document.querySelector("#category-create-form");

if (categoryCreateForm) {
  const validation = new JustValidate('#category-create-form');

  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên danh mục!'
      }
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const parent = event.target.parent.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      const description = tinymce.get("description").getContent();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
      }

      //tạo formdata
      const formData = new FormData();
      formData.append("name", name);
      formData.append("parent", parent);
      formData.append("position", position);
      formData.append("status", status);
      formData.append("avatar", avatar);
      formData.append("description", description);

      
      const fetchApi = async () => {
        const response = await fetch(`/${pathAdmin}/category/create`, {
          method: "POST",
          body: formData
        })
        const result = await response.json();
        if (result.code == "error") {
          alert(result.message);
        }
        else {
          window.location.href = `/${pathAdmin}/category/list`;
        }
      }
      fetchApi();

    });
}

// End Category Create Form


// Tour Create form
const tourCreateForm = document.querySelector("#tour-create-form");
if (tourCreateForm) {
  const validation = new JustValidate("#tour-create-form");

  validation
    .addField("#name", [
    {
      rule: "required",
      errorMessage: "Vui lòng nhập tên tour!",
    },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const category = event.target.category.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
      }
      const priceAdult = event.target.priceAdult.value;
      const priceChildren = event.target.priceChildren.value;
      const priceBaby = event.target.priceBaby.value;

      const priceNewAdult = event.target.priceNewAdult.value;
      const priceNewChildren = event.target.priceNewChildren.value;
      const priceNewBaby = event.target.priceNewBaby.value;

      const stockAdult = event.target.stockAdult.value;
      const stockChildren = event.target.stockChildren.value;
      const stockBaby = event.target.stockBaby.value;

      const locations = [];
      //locations
      const listElementLocation = document.querySelectorAll(`input[name="locations"]:checked`);
      listElementLocation.forEach(input => {
        locations.push(input.value);
      })
      // locations
      const time = event.target.time.value;
      const vehicle = event.target.vehicle.value;
      const departureDate = event.target.departureDate.value;
      const information = tinymce.get("information").getContent();
      const schedules = [];
      // schedules
      const listElementSchduleItem = tourCreateForm.querySelectorAll(".inner-schedule-item");
      listElementSchduleItem.forEach(scheduleItem => {
        const input = scheduleItem.querySelector("input");
        const title = input.value;
        const textarea = scheduleItem.querySelector("textarea");
        const idTextarea = textarea.id;
        const description = tinymce.get(idTextarea).getContent();

        schedules.push({
          title: title,
          description: description
        })
      })
      // end schedules

      console.log(name);
      console.log(schedules);
    })

}
// End tour create form


// Order form edit
const orderEditForm = document.querySelector("#order-edit-form");

if (orderEditForm) {
  const validation = new JustValidate("#order-edit-form");

  validation
    .addField("#fullName", [
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
        errorMessage: "Họ tên không vượt quá 50 kí tự!",
      },
    ])
    .addField("#phone", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập số điện thoại!",
      },
      {
        rule: "customRegexp",
        value: /^(84|0)[35789][0-9]{8}$/,
        errorMessage: "Số điện thoại không đúng định dạng!",
      },
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value;
      const phone = event.target.phone.value;
      const note = event.target.note.value;
      const paymentMethod = event.target.paymentMethod.value;
      const paymentStatus = event.target.paymentStatus.value;
      const status = event.target.status.value;
    });
}
// End order form edit

// Setting website Info form
const settingWebsiteInfoForm = document.querySelector("#setting-website-info-form");

if (settingWebsiteInfoForm) {
  const validation = new JustValidate("#setting-website-info-form");

  validation
    .addField("#websiteName", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên website!",
      }
    ])
    .addField("#email", [
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!",
      }
    ])
    .onSuccess((event) => {
      const websiteName = event.target.websiteName.value;
      const phone = event.target.phone.value;
      const email = event.target.email.value;
      const address = event.target.address.value;
      const logos = filePond.logo.getFiles();
      let logo = null;
      if (logos.length > 0) {
        logo = logos[0].file;
      }
      const favicons = filePond.favicon.getFiles();
      let favicon = null;
      if (favicons.length > 0) {
        favicon = favicons[0].file;
      }
      console.log({ websiteName, phone, email, address, logo, favicon });
    });
}
// End Setting website Info form


// Setting account admin create form
const settingAccountAmdminCreateForm = document.querySelector("#setting-account-admin-create-form");

if (settingAccountAmdminCreateForm) {
  const validation = new JustValidate("#setting-account-admin-create-form");

  validation
    .addField("#fullName", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập họ tên!",
      },
      {
        rule: "minLength",
        value: 5,
        errorMessage: "Họ tên phải ít nhất 5 kí tự!",
      },
      {
        rule: "maxLength",
        value: 50,
        errorMessage: "Họ tên tối đa 50 kí tự!",
      },
    ])
    .addField("#email", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email!",
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!",
      },
    ])
    .addField("#phone", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập số điện thoại!",
      },
      {
        rule: "customRegexp",
        value: /^(84|0)[35789][0-9]{8}$/,
        errorMessage: "Số điện thoại không đúng định dạng!",
      },
    ])
    .addField("#positionCompany", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập chức vụ!",
      },
    ])
    .addField("#password", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mật khẩu!",
      },
      {
        validator: (value) => value.length >= 8,
        errorMessage: "Mật khẩu phải chứa ít nhất 8 kí tự",
      },
      {
        validator: (value) => /[A-Z]/.test(value),
        errorMessage: "Mật khẩu phải chứa ít 1 chữ cái in hoa",
      },
      {
        validator: (value) => /[a-z]/.test(value),
        errorMessage: "Mật khẩu phải chứa ít 1 chữ cái in thường",
      },
      {
        validator: (value) => /\d/.test(value),
        errorMessage: "Mật khẩu phải chứa ít 1 chữ số",
      },
      {
        validator: (value) => /[@$?!%*]/.test(value),
        errorMessage: "Mật khẩu phải chứa ít 1 kí tự đặc biệt",
      },
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      const role = event.target.role.value;
      const positionCompany = event.target.positionCompany.value;
      const status = event.target.status.value;
      const password = event.target.password.value;
      const avatars = filePond.avatar.getFiles();

      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
      }

      console.log({
        fullName,
        email,
        phone,
        role,
        positionCompany,
        status,
        password,
        avatar,
      });
    });
}
// End Setting account admin create form


// Setting Role Create Form
const settingRoleCreateForm = document.querySelector("#setting-role-create-form");
if(settingRoleCreateForm) {
  const validation = new JustValidate('#setting-role-create-form');

  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên nhóm quyền!'
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const description = event.target.description.value;
      const permissions = [];

      // permissions
      const listElementPermission = settingRoleCreateForm.querySelectorAll('input[name="permissions"]:checked');
      listElementPermission.forEach(input => {
        permissions.push(input.value);
      });
      // End permissions

      console.log({
        name,
        description,
        permissions
      });
    });
}

// Profile Edit Form
const profileEditForm = document.querySelector("#profile-edit-form");
if(profileEditForm) {
  const validation = new JustValidate('#profile-edit-form');

  validation
    .addField('#fullName', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập họ tên!'
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: 'Họ tên phải có ít nhất 5 ký tự!'
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: 'Họ tên không được vượt quá 50 ký tự!'
      },
    ])
    .addField('#email', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập email!'
      },
      {
        rule: 'email',
        errorMessage: 'Email không đúng định dạng!'
      },
    ])
    .addField('#phone', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập số điện thoại!'
      },
      {
        rule: 'customRegexp',
        value: /^(84|0)[35789][0-9]{8}$/,
        errorMessage: 'Số điện thoại không đúng định dạng!'
      }
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      const avatars = filePond.avatar.getFiles();
      
      let avatar = null;
      if(avatars.length > 0) {
        avatar = avatars[0].file;
      }

      console.log({
        fullName,
        email,
        phone,
        avatar
      });
    });
}


// Profile change password form
const profileChangePasswordForm = document.querySelector("#profile-change-password");
if (profileChangePasswordForm) {
  const validation = new JustValidate("#profile-change-password");

  validation
    .addField("#password", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mật khẩu!",
      },
      {
        validator: (value) => value.length >= 8,
        errorMessage: "Mật khẩu phải chứa ít nhất 8 kí tự",
      },
      {
        validator: (value) => /[A-Z]/.test(value),
        errorMessage: "Mật khẩu phải chứa ít 1 chữ cái in hoa",
      },
      {
        validator: (value) => /[a-z]/.test(value),
        errorMessage: "Mật khẩu phải chứa ít 1 chữ cái in thường",
      },
      {
        validator: (value) => /\d/.test(value),
        errorMessage: "Mật khẩu phải chứa ít 1 chữ số",
      },
      {
        validator: (value) => /[@$?!%*]/.test(value),
        errorMessage: "Mật khẩu phải chứa ít 1 kí tự đặc biệt",
      },
    ])
    .addField("#confirmPassword", [
      {
        rule: "required",
        errorMessage: "Vui lòng xác nhận mật khẩu!",
      },
      {
        validator: (value, fields) => {
          const password = fields["#password"].elem.value;
          return value === password;
        },
        errorMessage: "Mật khẩu xác nhận không khớp!",
      },
    ])
    .onSuccess((event) => {
      const password = event.target.password.value;
      console.log(password);
    });
}
// End Profile change password form


// Sider
const sider = document.querySelector(".sider");
if (sider) {
  const pathNameCurrent = window.location.pathname;
  const splitPathNameCurrent = pathNameCurrent.split("/");
  const menuList = sider.querySelectorAll("a");
  menuList.forEach(item => {
    const href = item.href;
    const pathName = new URL(href).pathname;
    const splitPathName = pathName.split("/");
    if (
      splitPathNameCurrent[1] == splitPathName[1] &&
      splitPathNameCurrent[2] == splitPathName[2]
    ) {
      item.classList.add("active");
    }
  })
}
// End sider

// Logout
const buttonLogout = document.querySelector(".sider .inner-logout");
if (buttonLogout) {
  buttonLogout.addEventListener("click", () => {
    const fetchApi = async () => {
      const response = await fetch(`/${pathAdmin}/account/logout`, {
        method: "POST"
      })
      const result = await response.json();
      if (result.code == "success") {
        window.location.href = `/${pathAdmin}/account/login`;
      }
    }
    fetchApi();
  })
}
// End Logout


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