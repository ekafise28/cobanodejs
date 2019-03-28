$(function() {
  //text editor
  if ($("textarea#ta").length) {
    CKEDITOR.replace("ta");
  }
  //confirm delete 
  $("a.confirmDeletion").on("click", function() {
    if (!confirm("Are you sure want to delete this page?")) return false;
  });

  if ($("[data-fancybox]").length) {
    $("[data-fancybox]").fancybox();
  }

  //--------get kota
  // load_json_data('province');
  function load_json_data(nameid, provinceid)
  {
      var html_code = '';
      //wa-jib
      var getJSON = function(url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'json';
            xhr.onload = function() {
                var status = xhr.status;
                
                if (status == 200) {
                    callback(null, xhr.response);
                } else {
                    callback(status);
                }
            };        
            xhr.send();
      };
  
      getJSON('http://localhost:3000/admin/products/kotakabjson',  function(err, data) {
      html_code += '<option value="">Select '+ nameid +'</option>';
        $.each(data, function(key, value){
      
           if(value.province == provinceid)
           {
            html_code += '<option value="'+value.name+'">'+value.name+'</option>';
           }
        });
        $('#kota_kab').html(html_code);
       });
  }   

      $(document).on('change', '#province', function(){
          var province = $(this).val();
          if(province != '')
          {
           load_json_data('name', province);
          }
          else
          {
           $('#name').html('<option value="">Select city</option>');
          }
  });
  //--------end kota
});
