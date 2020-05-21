$(document).ready(function(){
    //contact form
    var contactForm = $(".contact-form")
    var contactFormMethod = contactForm.attr("method")
    var contactFormEndpoint = contactForm.attr("action")

    function displaySubmitting(submitBtn, defaultText, doSubmit){
        if(doSubmit){
            submitBtn.addClass("disabled")
            submitBtn.html("<i class='fa fa-spin fa-spinner'></i> Sending...")
        } else{
            submitBtn.removeClass("disabled")
            submitBtn.html(defaultText)
        }
    }

    contactForm.submit(function(event){
        event.preventDefault()
        var contactFormData = contactForm.serialize()
        var thisForm = $(this)
        var contactFormSubmitBtn = contactForm.find("[type='submit']")
        var contactFormSubmitBtnTxt = contactFormSubmitBtn.text()

        displaySubmitting(contactFormSubmitBtn, "", true)
        $.ajax({
            method:contactFormMethod,
            url:contactFormEndpoint,
            data:contactFormData,
            success: function(data){
                contactForm[0].reset()
                $.alert({
                    title:"success!",
                    content: data.message,
                    theme:"modern",

                })
                setTimeout(function(){
                    displaySubmitting(contactFormSubmitBtn, contactFormSubmitBtnTxt, false)
                }, 500)
            },
            error: function(error){
                //console.log(error.responseJSON)
                var jsonData = error.responseJSON
                var msg = ""
                $.each(jsonData, function(key, value){
                    msg += key + " : " + value[0].message + "<br/>"
                })
                $.alert({
                    title:"Ouups!!",
                    content: msg,
                    theme:"modern",

                })
                setTimeout(function(){
                    displaySubmitting(contactFormSubmitBtn, "", false)
                }, 500)
            }
        })
    })


    // auto search
    var searchForm = $(".search-form") 
    var searchInput = searchForm.find("[name='q']")
    var typingTimer;
    var typingInterval = 500
    var searchBtn = searchForm.find("[type='submit']")

    searchInput.keyup(function(event){
        clearTimeout(typingTimer)
        typingTimer = setTimeout(prformSearch, typingInterval)
    })

    function displaySearching(){
        searchBtn.addClass("disabled")
        searchBtn.html("<i class='fa fa-spin fa-spinner'></i> Searchin...")
    }

    function prformSearch(){
        displaySearching()
        var query = searchInput.val()
        setTimeout(function(){
            window.location.href='/search/?q=' + query
        }, 200)
    }

    // cart + add product
    var productForm = $(".form-product-ajax")
    productForm.submit(function(event){
        event.preventDefault()
        var thisForm = $(this)
        // var actionEndpoint = thisForm.attr("action");
        var actionEndpoint = thisForm.attr("data-endpoint");
        var httpMethod     = thisForm.attr("method");
        var formData       = thisForm.serialize();

        $.ajax({
            url: actionEndpoint,
            method: httpMethod,
            data: formData,
            success: function(data){
                var submitSpan = thisForm.find(".submit-span")
                if (data.added){
                    submitSpan.html("In cart <button type='submit'  class='btn btn-link' > Remove </button>")
                }
                else{
                    submitSpan.html("<button type='submit'  class='btn btn-success' > Add to cart </button>")
                }
                var navbarCount = $(".navbar-cart-count")
                navbarCount.text(data.cartItemsCount)
                var currentPath = window.location.href
                if (currentPath.indexOf("cart") != -1){
                    refreshCart()
                }
            },
            error: function(errorData){
                $.alert({
                    title:"Ouups!!",
                    content: "Am error occurred",
                    theme:"modern",

                })
            }
        })

    })

    function refreshCart(){
        console.log("in current cart")
        var cartTable = $(".cart-table")
        var cartBody = cartTable.find(".cart-body")
        var productRows = cartBody.find(".cart-product")
        var currentUrl = window.location.href
        var refreshCartUrl = '/api/cart/'
        var refreshCartMethod = "GET";
        var data = {};
        $.ajax({
            url: refreshCartUrl,
            method: refreshCartMethod,
            data: data,
            success: function(data){
                var hiddenCartItemRemoveForm = $(".cart-item-remove-form")
                    if (data.products.length > 0){
                        productRows.html(" ")
                        i = data.products.length
                        $.each(data.products, function(index, value){
                            var newCartItemRemove = hiddenCartItemRemoveForm.clone()
                            newCartItemRemove.css("display", "block")
                            newCartItemRemove.find(".cart-item-product_id").val(value.id)
                            cartBody.prepend("<tr><th scope=\"row\">" + i + "</th><td><a href= '" + value.url +"'>" + value.name + "</a>" + newCartItemRemove.html() +"</td><td>" + value.price + "</td></tr>")
                            i--
                        })
                        cartBody.find(".cart-subtotal").text(data.subtotal)
                        cartBody.find(".cart-total").text(data.total)
                    }
                    else{
                        window.location.href = currentUrl
                    }
            },
            error: function(errorData){
                $.alert({
                    title:"Ouups!!",
                    content: "Am error occurred",
                    theme:"modern",

                })
            }
        })
    }
})