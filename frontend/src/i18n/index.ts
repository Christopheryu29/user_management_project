import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Translation resources
const resources = {
  en: {
    translation: {
      // Header
      userManagement: "User Management",
      dashboard: "Dashboard",
      addUser: "Add User",

      // App
      "app.title": "User Management",
      "app.subtitle": "Professional Dashboard",

      // Stats
      totalUsers: "Total Users",
      currentPage: "Current Page",
      "stats.totalUsers": "Total Users",
      "stats.currentPage": "Current Page",

      // Search and Controls
      searchUsers: "Search Users",
      searchPlaceholder: "Search by name, occupation, or phone number...",
      viewMode: "View Mode",
      gridView: "Grid View",
      tableView: "Table View",
      "search.title": "Search Users",
      "search.placeholder": "Search by name, occupation, or phone number...",
      "search.viewMode": "View Mode",
      "search.gridView": "Grid View",
      "search.tableView": "Table View",

      // Pagination
      pageNavigation: "Page Navigation",
      previous: "Previous",
      next: "Next",
      "pagination.pageNavigation": "Page Navigation",
      "pagination.of": "of",
      "pagination.page": "Page",
      "pagination.total": "of",
      "pagination.previous": "Previous",
      "pagination.next": "Next",

      // User Form
      name: "Name",
      gender: "Gender",
      birthday: "Birthday",
      occupation: "Occupation",
      phone: "Phone",
      image: "Image",
      male: "Male",
      female: "Female",
      other: "Other",
      student: "Student",
      engineer: "Engineer",
      teacher: "Teacher",
      unemployed: "Unemployed",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",

      // User Fields
      "user.name": "Name",
      "user.gender": "Gender",
      "user.birthday": "Birthday",
      "user.occupation": "Occupation",
      "user.phone": "Phone",
      "user.contact": "Contact",
      "user.actions": "Actions",
      "user.born": "Born",
      "user.yearsOld": "years old",

      // Gender Options
      "gender.male": "Male",
      "gender.female": "Female",
      "gender.other": "Other",

      // Occupation Options
      "occupation.student": "Student",
      "occupation.engineer": "Engineer",
      "occupation.teacher": "Teacher",
      "occupation.unemployed": "Unemployed",

      // Actions
      "actions.cancel": "Cancel",
      "actions.create": "Create",
      "actions.update": "Update",
      "actions.edit": "Edit",
      "actions.delete": "Delete",

      // Validation
      "validation.nameRequired": "Name is required",
      "validation.nameMinLength": "Name must be at least 2 characters",
      "validation.nameMaxLength": "Name must be less than 50 characters",
      "validation.nameLettersOnly": "Name can only contain letters and spaces",
      "validation.birthdayRequired": "Birthday is required",
      "validation.ageRange": "Age must be between 18 and 100 years",
      "validation.phoneRequired": "Phone number is required",
      "validation.phoneInvalid": "Please enter a valid phone number",
      "validation.phoneLength": "Phone number must be 10-15 digits",

      // Messages
      userCreated: "User created successfully",
      userUpdated: "User updated successfully",
      userDeleted: "User deleted successfully",
      errorOccurred: "An error occurred",
      loading: "Loading...",
      noUsersFound: "No users found",
      "messages.deleteConfirm": "Are you sure you want to delete this user?",
      "messages.success": "Success",
      "messages.error": "Error",
      "messages.deleteFailed": "Failed to delete user",
      "messages.updateFailed": "Failed to update user",
      "messages.createFailed": "Failed to create user",
      "messages.loadingUsers": "Loading users...",
      "messages.pleaseWait": "Please wait...",
      "messages.noMatchingUsers": "No matching users found",
      "messages.noUsers": "No users found",
      "messages.noMatchingDescription": "Try adjusting your search criteria",
      "messages.noUsersDescription": "Get started by adding your first user",
      "messages.addFirstUser": "Add First User",

      // Modal
      "modal.editUser": "Edit User",
      "modal.addUser": "Add User",
      "modal.profilePicture": "Profile Picture",
      "modal.uploadHelp": "Click to upload or drag and drop",
      "modal.phoneExample": "Example: +1 (555) 123-4567",
      "modal.preview": "Preview",
      "modal.updateUser": "Update User",
      "modal.createUser": "Create User",

      // Table
      "table.usersTableView": "Users Table View",
      "table.user": "User",
      "table.ageAndGender": "Age & Gender",
      "table.phoneNumber": "Phone Number",

      // Language
      language: "Language",
      english: "English",
      chinese: "中文",
    },
  },
  zh: {
    translation: {
      // Header
      userManagement: "使用者管理",
      dashboard: "儀表板",
      addUser: "新增使用者",

      // App
      "app.title": "使用者管理",
      "app.subtitle": "專業儀表板",

      // Stats
      totalUsers: "總使用者數",
      currentPage: "目前頁面",
      "stats.totalUsers": "總使用者數",
      "stats.currentPage": "目前頁面",

      // Search and Controls
      searchUsers: "搜尋使用者",
      searchPlaceholder: "依姓名、職業或電話號碼搜尋...",
      viewMode: "檢視模式",
      gridView: "網格檢視",
      tableView: "表格檢視",
      "search.title": "搜尋使用者",
      "search.placeholder": "依姓名、職業或電話號碼搜尋...",
      "search.viewMode": "檢視模式",
      "search.gridView": "網格檢視",
      "search.tableView": "表格檢視",

      // Pagination
      pageNavigation: "頁面導航",
      previous: "上一頁",
      next: "下一頁",
      "pagination.pageNavigation": "頁面導航",
      "pagination.of": "共",
      "pagination.page": "頁",
      "pagination.total": "共",
      "pagination.previous": "上一頁",
      "pagination.next": "下一頁",

      // User Form
      name: "姓名",
      gender: "性別",
      birthday: "生日",
      occupation: "職業",
      phone: "電話",
      image: "圖片",
      male: "男",
      female: "女",
      other: "其他",
      student: "學生",
      engineer: "工程師",
      teacher: "教師",
      unemployed: "失業",
      save: "儲存",
      cancel: "取消",
      edit: "編輯",
      delete: "刪除",

      // User Fields
      "user.name": "姓名",
      "user.gender": "性別",
      "user.birthday": "生日",
      "user.occupation": "職業",
      "user.phone": "電話",
      "user.contact": "聯絡方式",
      "user.actions": "操作",
      "user.born": "出生於",
      "user.yearsOld": "歲",

      // Gender Options
      "gender.male": "男",
      "gender.female": "女",
      "gender.other": "其他",

      // Occupation Options
      "occupation.student": "學生",
      "occupation.engineer": "工程師",
      "occupation.teacher": "教師",
      "occupation.unemployed": "失業",

      // Actions
      "actions.cancel": "取消",
      "actions.create": "建立",
      "actions.update": "更新",
      "actions.edit": "編輯",
      "actions.delete": "刪除",

      // Validation
      "validation.nameRequired": "姓名為必填項目",
      "validation.nameMinLength": "姓名至少需要2個字元",
      "validation.nameMaxLength": "姓名不能超過50個字元",
      "validation.nameLettersOnly": "姓名只能包含字母和空格",
      "validation.birthdayRequired": "生日為必填項目",
      "validation.ageRange": "年齡必須在18-100歲之間",
      "validation.phoneRequired": "電話號碼為必填項目",
      "validation.phoneInvalid": "請輸入有效的電話號碼",
      "validation.phoneLength": "電話號碼必須是10-15位數字",

      // Messages
      userCreated: "使用者建立成功",
      userUpdated: "使用者更新成功",
      userDeleted: "使用者刪除成功",
      errorOccurred: "發生錯誤",
      loading: "載入中...",
      noUsersFound: "未找到使用者",
      "messages.deleteConfirm": "您確定要刪除此使用者嗎？",
      "messages.success": "成功",
      "messages.error": "錯誤",
      "messages.deleteFailed": "刪除使用者失敗",
      "messages.updateFailed": "更新使用者失敗",
      "messages.createFailed": "建立使用者失敗",
      "messages.loadingUsers": "正在載入使用者...",
      "messages.pleaseWait": "請稍候...",
      "messages.noMatchingUsers": "未找到符合的使用者",
      "messages.noUsers": "暫無使用者",
      "messages.noMatchingDescription": "請嘗試調整搜尋條件",
      "messages.noUsersDescription": "開始新增您的第一個使用者",
      "messages.addFirstUser": "新增第一個使用者",

      // Modal
      "modal.editUser": "編輯使用者",
      "modal.addUser": "新增使用者",
      "modal.profilePicture": "頭像",
      "modal.uploadHelp": "點擊上傳或拖拽檔案",
      "modal.phoneExample": "例如：+886 912 345 678",
      "modal.preview": "預覽",
      "modal.updateUser": "更新使用者",
      "modal.createUser": "建立使用者",

      // Table
      "table.usersTableView": "使用者表格檢視",
      "table.user": "使用者",
      "table.ageAndGender": "年齡與性別",
      "table.phoneNumber": "電話號碼",

      // Language
      language: "語言",
      english: "English",
      chinese: "繁體中文",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },

    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;
