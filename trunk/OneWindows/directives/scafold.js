var ScafoldDirectives;
(function (ScafoldDirectives) {
    var Shared = (function () {
        function Shared() {
        }
        Shared.prototype.injection = function () {
            return [Shared];
        };
        return Shared;
    })();
    ScafoldDirectives.Shared = Shared;
})(ScafoldDirectives || (ScafoldDirectives = {}));
//# sourceMappingURL=scafold.js.map
