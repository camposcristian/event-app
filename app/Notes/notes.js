angular.module('aac.notes.controller', [])

.controller('NotesController', function ($scope, $state, $ionicModal, Store, $ionicPopup) {

    //BORRAR EL LOCAL STORAGE
    //Store.clearAll();

    $scope.notes = Store.get('Notas');

    $scope.newNote = function () {
        $state.transitionTo("tab.note", { Index: $scope.notes.length });
    }

    $scope.edit = function (index) {
        $state.go("tab.note", { Index: index })
    }

    $scope.showModal = function (index) {
        $scope.indexToDelete = index;
        var confirmPopup = $ionicPopup.confirm({
            title: 'Borrar nota',
            template: 'Está seguro que desea borrar esta nota?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                $scope.deleteNote();
            }
            else {
            }
        });
    };

    $scope.deleteNote = function () {
        $scope.notes.splice($scope.indexToDelete, 1);
        Store.save('Notas', $scope.notes);
        $scope.hideModal();
        $state.transitionTo("tab.notes");
    }

})

.controller('NoteController', function ($scope, $stateParams, $state, Store) {


    var noteStorage = Store.get('Notas');

    if ($stateParams.Index == noteStorage.length)
        $scope.note = {}
    else
        $scope.note = noteStorage[$stateParams.Index];

    $scope.saveChanges = function () {
        if ($stateParams.Index == noteStorage.length)
            noteStorage.push({ title: $scope.note.title, description: $scope.note.description });
        Store.save('Notas', noteStorage);
        $state.transitionTo("tab.notes");

    };


})


