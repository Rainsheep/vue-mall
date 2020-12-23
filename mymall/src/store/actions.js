import * as types from './mutation-types'

export default {
  addToCart({state, commit}, info) {
    return new Promise(resolve => {
      const oldInfo = state.cartList.find(item => item.iid === info.iid)

      if (oldInfo) {
        const index = state.cartList.indexOf(oldInfo)
        commit(types.INCREMENT_COUNT, index)
      } else {
        info.count = 1;
        info.checked = true
        commit(types.ADD_TO_CART, info)
      }
      resolve();
    })
  }
}
