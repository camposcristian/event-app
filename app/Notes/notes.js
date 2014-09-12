angular.module('aac.notes.controller', [])

.controller('NotesController', function ($scope, $state, $ionicModal, Store) {

    //BORRAR EL LOCAL STORAGE
    //Store.clearAll();

    $scope.notes = Store.get('Notas');

    $scope.newNote = function () {
        $state.transitionTo("tab.note", { Index: $scope.notes.length });
    }

    $scope.showModal = function (index) {
        $scope.indexToDelete = index;
        $scope.modal.show();
    }

    $ionicModal.fromTemplateUrl('modalDelete.html', function (modal) {
        $scope.modal = modal;
    }, {
        animation: 'slide-in-up',
        focusFirstInput: true,
        scope: $scope
    });

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

.controller('ModalController', function ($scope, $state, Store) {


    $scope.hideModal = function () {
        $scope.modal.hide();
        $state.transitionTo("tab.notes");
    }

    $scope.deleteNote = function () {
        $scope.notes.splice($scope.indexToDelete, 1); 
        Store.save('Notas', $scope.notes);
        $scope.hideModal();
        $state.transitionTo("tab.notes");
    }
})

