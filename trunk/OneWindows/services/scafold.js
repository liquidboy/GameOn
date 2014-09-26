var ScafoldServices;
(function (ScafoldServices) {
    var Shared = (function () {
        function Shared() {
        }
        Shared.prototype.injection = function () {
            return [Shared];
        };
        return Shared;
    })();
    ScafoldServices.Shared = Shared;
})(ScafoldServices || (ScafoldServices = {}));
//# sourceMappingURL=scafold.js.map
