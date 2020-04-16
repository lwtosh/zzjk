export let validatePassword = (rule, value, callback) => {
  let reg = /[0-9a-zA-Z]{6,10}/
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (!reg.test(value)) {
    callback(new Error('密码必须是由6-10位数字和字母组合'))
  } else {
    callback()
  }
}

// export let validateInviteCode = (rule, value, callback) => {
//   let reg = /[0-9a-zA-Z]*/
//   if (!value) {
//     callback(new Error('请输入邀请码'))
//   } else if (!reg.test(value)) {
//     callback(new Error('邀请码格式不正确'))
//   } else {
//     callback()
//   }
// }

export let validPhone = (rule, value, callback) => {
  const reg = /^[1]([1-9])[0-9]{9}$/
  if (!value) {
    callback(new Error('请输入电话号码'))
  } else if (!reg.test(value)) {
    callback(new Error('请输入正确的11位手机号码'))
  } else {
    callback()
  }
}

export let validVerifycode = (rule, value, callback) => {
  const reg = /[0-9a-zA-Z]*/
  if (!value) {
    callback(new Error('请输入验证码'))
  } else if (!reg.test(value)) {
    callback(new Error('验证码格式不正确'))
  } else {
    callback()
  }
}
