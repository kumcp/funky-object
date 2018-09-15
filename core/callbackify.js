
const defaultCallbackOptions = {
    type: 0
}


const callbackify = (func, options) => {

    let opt = {
        ...defaultCallbackOptions,
        ...options
    }
    
    const CallbackifyMap = {
        0: (...args) => {

            let cb = args[args.length - 1]
            func(...args).then((result) => {

                cb(result)
            }).catch((err) => {
                cb(null, err)
            })
        },

    }


    return CallbackifyMap[opt.type]
}


const norm = (cb) => {

    func(...args).then((result) => {
        cb(result)
    })


}



module.exports = {
    callbackify
}