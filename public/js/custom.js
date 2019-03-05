/* $(function(){
    $('#delete_Employee').on('click', function () {
        var employeeId = $('#employeeId').val();
        
        console.log(employeeId);

        $.ajax({
            url: "/delete/" + employeeId,
            type: 'post',
            contentType: 'application/json',

            data: {

            },
            dataType: 'json',
            success: function (data) {
                console.log(data);
                location.href = '/';

            },
            error: function (err) {
                
            }

        })
    });

    
}) */