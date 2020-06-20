// const updateAllUser = (users = []) => ({
//   type: 'UPDATE_ALL_USER',
//   payload: users
// })

const updateAllUser = (value) => {

  return {
    type: 'UPDATE_ALL_USER',
    payload: value
  }

}


export { updateAllUser }