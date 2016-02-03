/**
 * Created by hanwencheng on 1/9/16.
 */

const LOAD = 'Nevermind/entity/LOAD';
const LOAD_SUCCESS = 'Nevermind/entity/LOAD_SUCCESS';
const LOAD_FAIL = 'Nevermind/entity/LOAD_FAIL';
const CLEAR = 'Nevermind/entity/CLEAR'
const OPEN_CONTACT = "Nevermind/entity/OPEN_CONTACT";
const CLOSE_CONTACT = "Nevermind/entity/CLOSE_CONTACT";
const START_EDIT = "Nevermind/entity/START_EDIT";
const END_EDIT = "Nevermind/entity/END_EDIT";

const initState = {
  loaded: false,
  saveError: {},
  editing : false,
  contactOpen : false,
  data : {
    location: "地址",
    city: "城市",//which should be a string
    roomNumber: "房间数",
    size : "面积",
    price: "价格",
    caution: "押金",
    startDate : "开始日期",
    endDate : "无期限",
    description: "房屋介绍",
    title : "标题",
    owner : "所有人",
    email : "邮箱",
    phone : "请通过邮箱联系",
    type : "类型:长期或者短期",
    note : "一些备注",
    maximumPerson : 3,
  }
};

export default function reducer(state = initState, action){
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        loadedId : action.result.id,
        data: action.result,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        error: action.error
      };
    case CLEAR:
      return {
        initState
      }
    case CLOSE_CONTACT:
      return {
        ...state,
        contactOpen : false
      }
    case OPEN_CONTACT:
      return {
        ...state,
        contactOpen : true
      }
    case START_EDIT:
      return {
        ...state,
        editing : true
      }
    case END_EDIT:
      return {
        ...state,
        editing :true
      }
    default :
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.entity && globalState.entity.loaded;
}

export function clear(){
  return {
    type: CLEAR
  }
}

export function onContactOpen(){
  return {
    type: OPEN_CONTACT
  }
}

export function onContactClose(){
  return {
    type : CLOSE_CONTACT
  }
}

export function onStartEdit(){
  return {
    type : START_EDIT
  }
}

export  function onEndEdit(){
  return {
    type : END_EDIT
  }
}

export function load(number){
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => {
      const url = '/house/' + number
      console.log('request url is', url)
      return client.get(url)
    } // params not used, just shown as demonstration
  };
}