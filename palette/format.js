
class Format {

    callback(param) {
        param.success = param.success || function () { };
        param.fail = param.fail || function () { };
        param.complete = param.complete || function () { };
        param._success = function (res) {
            param.success(res);
            param.complete(res);
        };
        param._fail = function (res) {
            param.fail(res);
            param.complete(res);
        };
    }

}

export default new Format();