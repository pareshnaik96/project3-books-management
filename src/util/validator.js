const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}
const isValid1 = function (title) {                                                              //enum validation
    return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
};
const isValid2 = function (name) {                                                               //validation for name
    let nameRegex = /^[a-zA-Z ]{2,}$/
    return nameRegex.test(name)
};
const isValid3 = function (phone) {                                                             //validation for phone
    let phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    return phoneRegex.test(phone)
};
const isValid4 = function (email) {                                                               //validation for email
    let emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    return emailRegex.test(email)
};
const isValid5 = function (password) {                                                            //validation for password
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
    return passwordRegex.test(password)
};


module.exports.isValid=isValid
module.exports.isValid1= isValid1
module.exports.isValid2 = isValid2
module.exports.isValid3 = isValid3
module.exports.isValid4 = isValid4
module.exports.isValid5 = isValid5