// function asyncWrap(fn){
//     return function(req, res, next){
//         fn(req, res, next ).catch((err)=> next(err));
//     };
// }

// module.exports = asyncWrap;

//or
module.exports = (fn)=>{
    return (req, res, next) => {
        fn(req, res, next ).catch(next);
    };
}

