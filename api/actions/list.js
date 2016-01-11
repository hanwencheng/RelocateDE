/**
 * Created by hanwencheng on 1/9/16.
 */

export default function listHause(req, params) {
  console.log('in api list.js params are', params)
  var totalNum = parseInt(params[0])
  return new Promise((resolve) => {
    var result = []
    for(let i= 0; i < totalNum; i ++){
      result.push(i + "times visited");
    }


    setTimeout(()=>{
      resolve({
        entities : result,
        id : params[0],//which should be a string
        time: Date.now()
      });
    },1000)

  });
}
