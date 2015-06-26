module Application.Services {
    export interface IInstanceFactory {
        getInstance(instanceName: string): Object;
    }

    export class InstanceFactory {
        location: ng.ILocationService;


        public injection(): Array<any> {
            return [
                () => { return [InstanceFactory]; }
            ];
        }
        constructor($location: ng.ILocationService) {
            this.location = $location;
        }

        getInstance(instanceName: string) {
            var obj = {};
            if (instanceName == "_object")
                obj = {
                        Name: "",
                        NameIsReadOnly: false,
                        LongName: "",
                        Grouping: "",
                        GroupingIsReadOnly: false,
                        Color: "",
                        DisplayId: "",
                        IsSelected: false,
                        _Model: {}
                };

            return obj;
        }

   
    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.service("instanceFactory", ["$location", ($location) => new InstanceFactory($location)]);
} 