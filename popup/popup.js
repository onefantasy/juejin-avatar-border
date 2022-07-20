import avatarBorderList from './avatarBorderList.js'

/**
 * 获取页面操作元素
 */
// 获取 添加 按钮
const addAvatarBorder = document.querySelector("#addAvatarBorder")
// 获取 移除 按钮
const removeAvatarBorder = document.querySelector('#removeAvatarBorder')
// 选择头像框相关元素
const avatarSelectList = document.querySelector('#avatarSelectList')
const avatarSelectInput = document.querySelector('#avatarSelectInput')
// 执行结果元素
const result = document.querySelector('#result')


/**
 * 全局变量
 */
// 当前选中的头像框
let currentAvatarBorder = ''
// 当前选中的头像框的样式
let currentCssValue = ''
// 需要处理头像的条件
let avatarCondition = []
// 执行结果返回值
const resultList = [
  { face: '(￣y▽,￣)╭ ', text: '执行成功 !' },
  { face: '(°ー°〃)', text: '请先选择头像框 !' },
  { face: '(￣_￣|||)', text: '请先选择需要处理的头像 !' },
  { face: 'ㄟ( ▔, ▔ )ㄏ', text: '找不到对应的用户头像 !' },
  { face: '(╬▔皿▔)╯', text: '未知的错误 !' }
]
const myAvatarBorderClassName = 'my-avatar-border'


/**
 * 头像框选择列表
 */
/** 初始化头像框选项 */
function initAvatarSelectorOptions () {
  if (!avatarSelectList) { return false }
  avatarBorderList.forEach(item => {
    const option = document.createElement('li')
    option.innerText = item.name
    avatarSelectList.appendChild(option)
  })
}
initAvatarSelectorOptions()
// 监听头像框选中事件
avatarSelectList.addEventListener('click', (event) => {
  const { target } = event
  avatarSelectInput.value = target.innerText
  currentAvatarBorder = target.innerText
  event.stopPropagation()
})


/**
 *  添加 按钮事件处理
 */
addAvatarBorder.addEventListener('click', async () => {
  // 没有选择头像框 提示
  if (!currentAvatarBorder) {
    changeResult(1)
    return false
  }
  // 不存在头像筛选条件 提示
  const avatars = document.getElementsByName('avatar')
  let flag = false
  avatarCondition = []
  for (let i = 0, len = avatars.length; i < len; i++) {
    const item = avatars[i]
    flag || (flag = (item.type === 'checkbox' && item.checked) || (item.type === 'text' && item.value))
    avatarCondition.push({ checked: item.checked, type: item.type, value: item.value })
  }
  if (!flag) {
    changeResult(2)
    return false
  }
  // 删除此前的样式
  currentCssValue && (handleRemoveAvatarBorder())

  // 获取页面，执行添加头像框
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  // 注入样式
  const css = avatarBorderList.find(item => item.name === currentAvatarBorder)
  currentCssValue = css && css.value ? `.${myAvatarBorderClassName}{${css.value.element};box-sizing: border-box;}.${myAvatarBorderClassName}::after{${css.value.after}}.${myAvatarBorderClassName}::before{${css.value.before}}${css.value.other}` : ''
  chrome.scripting.insertCSS({ target: { tabId: tab.id }, css: currentCssValue  })
  // 注入事件
  chrome.scripting.executeScript({ target: { tabId: tab.id }, function: setAvatarBorder, args: [avatarCondition, myAvatarBorderClassName]}, (injectionResults) => {
    const result = injectionResults[0].result
    changeResult(isNaN(result) ? 4 : result)
  })
})
/** 添加头像框函数 */
function setAvatarBorder(avatarCondition, myAvatarBorderClassName) {
  /** 获取页面头像元素 */
  function getAvatarElements () {
    // 获取全部头像框
    if (avatarCondition[0].checked) {
      return document.querySelectorAll('.avatar')
    }
    // 获取导览栏头像框
    if (avatarCondition[1].checked) {
      return document.querySelectorAll('.main-nav .avatar')
    }
    // 获取指定用户名称的头像框
    const allAvatarElement = document.querySelectorAll('.avatar')
    const userName = avatarCondition[2].value
    const list = []
    for (let i = 0, len = allAvatarElement.length; i < len; i++) {
      const item = allAvatarElement[i]
      item.alt.includes(userName) && list.push(item)
    }
    // 部分 img.alt 属性获取不到用户名称，只能按照用户名称查找方式
    const userNameList = document.querySelectorAll('.username')
    for (let i = 0, len = userNameList.length; i < len; i++) {
      const item = userNameList[i]
      if (item.innerText.includes(userName)) {
        const target = item.parentNode.parentNode.parentNode.querySelector('.avatar')
        target && list.push(target)
      }
    }
    return list
  }

  // 添加头像框
  const avatarElementList = getAvatarElements()
  if (avatarElementList.length <= 0) {
    return 3
  }
  const avatarBorder = document.createElement('span')
  avatarBorder.classList.add(myAvatarBorderClassName)
  for (let i = 0, len = avatarElementList.length; i < len; i++) {
    const targetAvatarElement = avatarElementList[i]
    const cloneElement = avatarBorder.cloneNode(true)
    cloneElement.style = `display:inline-block;width: ${targetAvatarElement.clientWidth}px;height: ${targetAvatarElement.clientHeight}px;`
    const parentNode = targetAvatarElement.parentNode
    cloneElement.appendChild(targetAvatarElement)
    parentNode.appendChild(cloneElement)
  }
  return 0
}


/**
 * 移除 按钮事件处理
 */
removeAvatarBorder.addEventListener('click', () => {
  handleRemoveAvatarBorder()
})
/** 处理移除头像框 */
async function handleRemoveAvatarBorder () {
  // 获取页面，执行添加头像框
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  // 注入事件
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: execRemoveAvatarBorder,
    args: [myAvatarBorderClassName]
  },
  (injectionResults) => {
    const result = injectionResults[0].result
    changeResult(isNaN(result) ? 4 : result)
  })
  // 删除注入的样式表
  chrome.scripting.removeCSS({ target: { tabId: tab.id }, css: currentCssValue  })
}
function execRemoveAvatarBorder (myAvatarBorderClassName) {
  const avatarBorderElementList = document.querySelectorAll(`.${myAvatarBorderClassName}`)
  for (let i = 0, len = avatarBorderElementList.length; i < len; i++) {
    const target = avatarBorderElementList[i]
    const parentNode = target.parentNode
    const img = target.childNodes[0]
    parentNode.removeChild(target)
    parentNode.append(img)
  }
  return 0
}

/** 更改执行结果 */
function changeResult (index) {
  const target = resultList[index]
  if (!result || !target) { return false }
  result.innerHTML = ''
  // 添加表情
  const face = document.createElement('span')
  face.classList.add('face')
  face.innerText = target.face
  result.appendChild(face)
  //  添加提示文字
  const text = document.createElement('span')
  text.classList.add('text')
  text.innerText = target.text
  result.appendChild(text)
}
