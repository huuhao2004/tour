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

    //hiện thỉ ảnh
    let files = null;
    const elementImageDefault = item.closest("[image-default]");
    if (elementImageDefault) {
      const imageDefault = elementImageDefault.getAttribute("image-default");
      if (imageDefault) {
        files = [
          {
            source: imageDefault
          }
        ]
      }
    }

    filePond[item.name] = FilePond.create(item, {
      labelIdle: "+",
      files: files,
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

// Category Edit Form
const categoryEditForm = document.querySelector("#category-edit-form");

if (categoryEditForm) {
  const validation = new JustValidate("#category-edit-form");

  validation
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên danh mục!",
      },
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

        // file ảnh đã up thì k up lên cloud nữa
        const elementImageDefault = event.target.avatar.closest("[image-default]");
        if (elementImageDefault) {
          const imageDefault = elementImageDefault.getAttribute("image-default");
          if (imageDefault.includes(avatar.name)) {
            avatar = null;
          }
        }
      }

      //tạo formdata
      const formData = new FormData();
      formData.append("name", name);
      formData.append("parent", parent);
      formData.append("position", position);
      formData.append("status", status);
      formData.append("avatar", avatar);
      formData.append("description", description);

      const id = window.location.pathname.split("/").pop();

      const fetchApi = async () => {
        const response = await fetch(`/${pathAdmin}/category/edit/${id}`, {
          method: "PATCH",
          body: formData,
        });
        const result = await response.json();
        if (result.code == "error") {
          alert(result.message);
        } else {
          window.location.href = `/${pathAdmin}/category/edit/${id}`;
        }
      };
      fetchApi();
    });
}

// End Category Edit Form

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

      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("position", position);
      formData.append("status", status);
      formData.append("avatar", avatar);
      formData.append("priceAdult", priceAdult);
      formData.append("priceChildren", priceChildren);
      formData.append("priceBaby", priceBaby);
      formData.append("priceNewAdult", priceNewAdult);
      formData.append("priceNewChildren", priceNewChildren);
      formData.append("priceNewBaby", priceNewBaby);
      formData.append("stockAdult", stockAdult);
      formData.append("stockChildren", stockChildren);
      formData.append("stockBaby", stockBaby);
      formData.append("locations", JSON.stringify(locations));
      formData.append("time", time);
      formData.append("vehicle", vehicle);
      formData.append("departureDate", departureDate);
      formData.append("information", information);
      formData.append("schedules", JSON.stringify(schedules));


      const fetchApi = async () => {
        const response = await fetch(`/${pathAdmin}/tour/create`, {
          method: "POST",
          body: formData
        });
        const result = await response.json();
        if (result.code == "error") {
          alert(data.message);
        }
        else if (result.code == "success") {
          window.location.href = `/${pathAdmin}/tour/list`;
        }
      }
      fetchApi();
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
        const elementImageDefault = event.target.logo.closest("[image-default]");
        const imageDefault = elementImageDefault.getAttribute("image-default");
        if (imageDefault.includes(logo.name)) {
          logo = null;
        }
      }

      const favicons = filePond.favicon.getFiles();
      let favicon = null;
      if (favicons.length > 0) {
        favicon = favicons[0].file;
        const elementImageDefault = event.target.favicon.closest("[image-default]");
        const imageDefault = elementImageDefault.getAttribute("image-default");
        console.log(imageDefault, favicon);
        console.log(imageDefault.includes(favicon.name));
        if (imageDefault.includes(favicon.name)) {
          favicon = null;
        }
      }

      const formData = new FormData();
      formData.append("websiteName", websiteName);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("address", address);
      formData.append("logo", logo);
      formData.append("favicon", favicon);

      const fetchApi = async () => {
        const response = await fetch(`/${pathAdmin}/setting/website-info`, {
          method: "PATCH",
          body: formData
        });
        const result = await response.json();
        if (result.code == "success") {
          window.location.reload();
        }
        else if (result.code == "error") {
          alert(result.message);
        }
      }
      fetchApi();
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
if (settingRoleCreateForm) {
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

      const dataFinal = {
        name,
        description,
        permissions
      };

      const fetchApi = async () => {
        const response = await fetch(`/${pathAdmin}/setting/role/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dataFinal)
        });
        const result = await response.json();
        if (result.code == "success") {
          window.location.href = `/${pathAdmin}/setting/role/list`
        } else if (result.code == "error") {
          alert(result.message)
        }
      }
      fetchApi();

    });
}
// End setting role create form

// Setting Role Create Form
const settingRoleEditForm = document.querySelector("#setting-role-edit-form");
if (settingRoleEditForm) {
  const validation = new JustValidate('#setting-role-edit-form');

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
      const listElementPermission = settingRoleEditForm.querySelectorAll('input[name="permissions"]:checked');
      listElementPermission.forEach(input => {
        permissions.push(input.value);
      });
      // End permissions

      const dataFinal = {
        name,
        description,
        permissions
      };

      const id = window.location.href.split("/").pop();

      const fetchApi = async () => {
        const response = await fetch(`/${pathAdmin}/setting/role/edit/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dataFinal)
        });
        const result = await response.json();
        if (result.code == "success") {
          window.location.href = `/${pathAdmin}/setting/role/list`
        } else if (result.code == "error") {
          alert(result.message);
        }
      }
      fetchApi();

    });
}
// End setting role create form

// Profile Edit Form
const profileEditForm = document.querySelector("#profile-edit-form");
if (profileEditForm) {
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
      if (avatars.length > 0) {
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

// Button Delete
const listButtonDelete = document.querySelectorAll("[button-delete]");
if (listButtonDelete.length > 0) {
  listButtonDelete.forEach(button => {
    button.addEventListener("click", () => {
      const dataApi = button.getAttribute("data-api");

      const isConfirm = confirm("Bạn có chắc chắn muốn xóa không?");

      if (!isConfirm) {
        return;
      }

      const fetchApi = async () => {
        const response = await fetch(dataApi, {
          method: "PATCH",
        })
        const result = await response.json();
        if (result.code == "error") {
          alert(result.message);
        }
        if (result.code == "success") {
          window.location.reload();
        }
      }
      fetchApi();
    })
  })
}
// End button delete

// Button undo
const listButtonUndo = document.querySelectorAll("[button-undo]");
if (listButtonUndo.length > 0) {
  listButtonUndo.forEach(button => {
    button.addEventListener("click", () => {
      const dataApi = button.getAttribute("data-api");
      const isConfirm = confirm("Bạn có chắc chắn muốn hoàn tác không?");

      if (!isConfirm) {
        return;
      }

      const fetchApi = async () => {
        const response = await fetch(dataApi, {
          method: "PATCH"
        });
        const result = await response.json();
        if (result.code == "success") {
          window.location.reload();
        }
        else {
          alert(result.message);
        }
      }
      fetchApi();
    })
  })
}
// End 

// Filter status
const filterStatus = document.querySelector("[filter-status]");
if (filterStatus) {
  const url = new URL(window.location.href);
  //lang nghe su kien thay doi
  filterStatus.addEventListener("change", () => {
    const value = filterStatus.value;
    if (value) {
      url.searchParams.set("status", value);
    } else {
      url.searchParams.delete("status");
    }
    window.location.href = url;
  })

  const valueCurrent = url.searchParams.get("status");
  if (valueCurrent) {
    filterStatus.value = valueCurrent;
  }

}
// End filter status

// Filter craeted by
const filterCreatedBy = document.querySelector("[filter-created-by]");
if (filterCreatedBy) {
  const url = new URL(window.location.href);

  filterCreatedBy.addEventListener("change", () => {
    const value = filterCreatedBy.value;
    if (value) {
      url.searchParams.set("createdBy", value);
    } else {
      url.searchParams.delete("createdBy");
    }
    window.location.href = url;
  })

  const valueCurrent = url.searchParams.get("createdBy");
  if (valueCurrent) {
    filterCreatedBy.value = valueCurrent;
  }
}
// End filter created by

// Filter start date
const filterStartDate = document.querySelector("[filter-start-date]");
if (filterStartDate) {
  const url = new URL(window.location.href);

  filterStartDate.addEventListener("change", () => {
    const value = filterStartDate.value;
    if (value) {
      url.searchParams.set("startDate", value);
    } else {
      url.searchParams.delete("startDate");
    }
    window.location.href = url;
  });

  const valueCurrent = url.searchParams.get("startDate");
  if (valueCurrent) {
    filterStartDate.value = valueCurrent;
  }
}
// End filter start date

// Filter end date
const filterEndDate = document.querySelector("[filter-end-date]");
if (filterEndDate) {
  const url = new URL(window.location.href);

  filterEndDate.addEventListener("change", () => {
    const value = filterEndDate.value;
    if (value) {
      url.searchParams.set("endDate", value);
    } else {
      url.searchParams.delete("endDate");
    }
    window.location.href = url;
  });

  const valueCurrent = url.searchParams.get("endDate");
  if (valueCurrent) {
    filterEndDate.value = valueCurrent;
  }
}
// End filter end date

// Fitler category
const filterCategory = document.querySelector("[filter-category]");
if (filterCategory) {
  const url = new URL(window.location.href);

  filterCategory.addEventListener("change", () => {
    const value = filterCategory.value;
    if (value) {
      url.searchParams.set("category", value);
    }
    else {
      url.searchParams.delete("category");
    }
    window.location.href = url;
  })
  const valueCurrent = url.searchParams.get("category");
  if (valueCurrent) {
    filterCategory.value = valueCurrent;
  }
}
// End filter category

// Filter price
const filterPrice = document.querySelector("[filter-price]");
if (filterPrice) {
  const url = new URL(window.location.href);
  filterPrice.addEventListener("change", () => {
    const value = filterPrice.value;
    if (value) {
      url.searchParams.set("price", value);
    }
    else {
      url.searchParams.delete("price");
    }
    window.location.href = url;
  })
  const valueCurrent = url.searchParams.get("price");
  if (valueCurrent) {
    filterPrice.value = valueCurrent;
  }
}
// End filter price

// Filter reset
const filerReset = document.querySelector("[filter-reset]");
if (filerReset) {
  const url = new URL(window.location.href);

  filerReset.addEventListener("click", () => {
    url.search = "";
    window.location.href = url;
  })
}
// End filter reset

// Check all
const checkAll = document.querySelector("[check-all]");
if (checkAll) {
  checkAll.addEventListener("click", () => {
    const listItem = document.querySelectorAll("[check-item]");
    if (checkAll.checked) {
      listItem.forEach(item => {
        item.checked = true;
      })
    }
    else {
      listItem.forEach((item) => {
        item.checked = false;
      });
    }
  })
}
// End check all

// Change multi
const changeMulti = document.querySelector("[change-multi]");
if (changeMulti) {
  const select = changeMulti.querySelector("select");
  const button = changeMulti.querySelector("button");

  button.addEventListener("click", () => {
    const option = select.value;
    const listInputChecked = document.querySelectorAll("[check-item]:checked");
    if (option && listInputChecked.length > 0) {
      const ids = [];
      listInputChecked.forEach(item => {
        ids.push(item.getAttribute("check-item"))
      })
      const dataFinal = {
        option: option,
        ids: ids
      };

      const dataApi = changeMulti.getAttribute("data-api");

      const fetchApi = async () => {
        const response = await fetch(dataApi, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dataFinal)
        })
        const result = await response.json();
        if (result.code == "error") {
          alert(result.message);
        }
        else {
          window.location.reload();
        }
      }
      fetchApi();
    }
  })
}
// End change multi

// Search
const search = document.querySelector("[search]");
if (search) {
  const url = new URL(window.location.href);

  search.addEventListener("keyup", (event) => {
    if (event.code == "Enter") {
      const value = search.value;
      if (value) {
        url.searchParams.set("keyword", value);
      }
      else {
        url.searchParams.delete("keyword");
      }
      window.location.href = url;
    }
  })
  const valueCurrent = url.searchParams.get("keyword");
  if (valueCurrent) {
    search.value = valueCurrent;
  }
}
// End search

// panination
const pagination = document.querySelector("[pagination]");
if (pagination) {
  const url = new URL(window.location.href);
  pagination.addEventListener("change", () => {
    const value = pagination.value;
    if (value) {
      url.searchParams.set("page", value);
    } else {
      url.searchParams.delete("page");
    }
    window.location.href = url;
  })
  const valueCurrent = url.searchParams.get("page");
  if (valueCurrent) {
    pagination.value = valueCurrent;
  }
}
// end pagintaion


// Tour Edit Form
const tourEditForm = document.querySelector("#tour-edit-form");
if (tourEditForm) {
  const validation = new JustValidate("#tour-edit-form");

  validation
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên danh mục!",
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

        // file ảnh đã up thì k up lên cloud nữa
        const elementImageDefault =
          event.target.avatar.closest("[image-default]");
        if (elementImageDefault) {
          const imageDefault =
            elementImageDefault.getAttribute("image-default");
          if (imageDefault.includes(avatar.name)) {
            avatar = null;
          }
        }
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
      const listElementLocation = document.querySelectorAll(
        `input[name="locations"]:checked`,
      );
      listElementLocation.forEach((input) => {
        locations.push(input.value);
      });
      // locations
      const time = event.target.time.value;
      const vehicle = event.target.vehicle.value;
      const departureDate = event.target.departureDate.value;
      const information = tinymce.get("information").getContent();
      const schedules = [];
      // schedules
      const listElementSchduleItem = tourEditForm.querySelectorAll(
        ".inner-schedule-item",
      );
      listElementSchduleItem.forEach((scheduleItem) => {
        const input = scheduleItem.querySelector("input");
        const title = input.value;
        const textarea = scheduleItem.querySelector("textarea");
        const idTextarea = textarea.id;
        const description = tinymce.get(idTextarea).getContent();

        schedules.push({
          title: title,
          description: description,
        });
      });
      // end schedules

      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("position", position);
      formData.append("status", status);
      formData.append("avatar", avatar);
      formData.append("priceAdult", priceAdult);
      formData.append("priceChildren", priceChildren);
      formData.append("priceBaby", priceBaby);
      formData.append("priceNewAdult", priceNewAdult);
      formData.append("priceNewChildren", priceNewChildren);
      formData.append("priceNewBaby", priceNewBaby);
      formData.append("stockAdult", stockAdult);
      formData.append("stockChildren", stockChildren);
      formData.append("stockBaby", stockBaby);
      formData.append("locations", JSON.stringify(locations));
      formData.append("time", time);
      formData.append("vehicle", vehicle);
      formData.append("departureDate", departureDate);
      formData.append("information", information);
      formData.append("schedules", JSON.stringify(schedules));


      const id = window.location.pathname.split("/").pop();

      const fetchApi = async () => {
        const response = await fetch(`/${pathAdmin}/tour/edit/${id}`, {
          method: "PATCH",
          body: formData,
        });
        const result = await response.json();
        if (result.code == "error") {
          alert(result.message);
        } else {
          window.location.href = `/${pathAdmin}/tour/edit/${id}`;
        }
      };
      fetchApi();
    });
}
// End tour edit


