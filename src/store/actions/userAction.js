// const updateAllUser = (users = []) => ({
//   type: 'UPDATE_ALL_USER',
//   payload: users
// })

const updateAllUser = (value) => {

  // console.log('action executada!')

  return {
    type: 'UPDATE_ALL_USER',
    payload: value
  }

}


export { updateAllUser }