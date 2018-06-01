
document.addEventListener('DOMContentLoaded', function() {

  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
  

  $(document).ready(function(){
    $('.sidenav').sidenav();
  });


  var elems2 = document.querySelectorAll('.collapsible');
  var instances2 = M.Collapsible.init(elems2);
  

  // Or with jQuery

  $(document).ready(function(){
    $('.collapsible').collapsible();
  });
})

