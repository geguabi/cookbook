$(function(){
    console.log('list.js');
    
    // behivatkozik, kijelöli adott elemet és elmenti
    // ami $-al kezdődik az JQuery objektum
    var $errorTable = $('#errorTable');
    console.log($errorTable);
    
    var statusClasses = {
        'new': 'danger',
        'assigned': 'info',
        'ready': 'success',
        'rejected': 'default',
        'pending': 'warning',
    };
    
    var types = ['new', 'assigned', 'ready'];
    
    var rows = {};
    types.forEach(function(type){
        var $trs = $errorTable.find('tbody tr .label-' + statusClasses[type]).closest('tr');
        //console.log($trs);
        rows[type] = $trs;
    });
    
});
