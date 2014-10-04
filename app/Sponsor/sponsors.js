angular.module('aac.sponsor.controller', [])

.controller('SponsorPlatinumController', function ($scope, Store) {
    $scope.sponsors = Store.get('SponsorsPlatinum')
    $scope.type = "Platino"
})

.controller('SponsorGoldController', function ($scope, Store) {
    $scope.sponsors = Store.get('SponsorsGold')
    $scope.type = "Oro"
})

.controller('SponsorSilverController', function ($scope, Store) {
    $scope.sponsors = Store.get('SponsorsSilver')
    $scope.type = "Plata"
})

.controller('SponsorDescriptionController', function ($scope, Store, $stateParams) {
    $scope.carga = function () {
        var sponsors = [];
        var selectedSponsor = [];
       
        if ($stateParams.Type === "Platino")
            sponsors = Store.get("SponsorsPlatinum");
        else if($stateParams.Type === "Oro")
            sponsors = Store.get("SponsorsGold");
        else
            sponsors = Store.get("SponsorsSilver");

        sponsors.forEach(function (sponsor) {
            if (sponsor.id === $stateParams.Id)
                selectedSponsor = sponsor;
        })

        return selectedSponsor;
    };

    $scope.sponsor = $scope.carga();
})

.controller('SponsorsTypeController', function ($scope, Store, WebApiFactory) {

    //CARGA DE DATOS
    $scope.carga = function () {

        var allSponsors = [];
        var gold = [];
        var silver = [];
        var platinum = [];


        WebApiFactory.all('tables/Sponsor').success(function (allSponsors) {

           if (allSponsors.length > 0) {
               allSponsors.forEach(function (sponsor) {
                   if(sponsor.type === "Platino")
                       platinum.push(sponsor)
                   else if (sponsor.type === "Oro")
                       gold.push(sponsor)
                   else 
                       silver.push(sponsor)
                 });
           };

           if (platinum.length > 0)
           {
               Store.remove('SponsorsPlatinum');
               Store.save('SponsorsPlatinum', platinum);
           }
           if (gold.length > 0) {
               Store.remove('SponsorsGold');
               Store.save('SponsorsGold', gold);
           }
           if (silver.length > 0) {
               Store.remove('SponsorsSilver');
               Store.save('SponsorsSilver', silver);
           }
        });
    };


})