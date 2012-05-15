/*===== Form Beautifier
============================================================ */

jQuery.fn.FormBeautifier = function(){
    this.each(function(i, el){
        var $el = $(el);
        var nodeName = el.nodeName.toLowerCase();
        switch(nodeName){
            case "select":
                $el = $(el).parents("[class*=dropdown]");
                $el.select = $el.children("select");
                $el.selected = $el.find(".dd-num");
                $el.title = $el.find(".dd-text");
                $el.list = $el.find("ol");
                $el.bind("click", function(e){
                    $el.offclick(function(e){
                        $el.removeClass("active");
                    });
                    if($(this).hasClass("disabled")) return;
                    $(this).toggleClass("active");
                    if(e.target.parentNode !== $el.list[0]) return;
                    var value = $(e.target).text();
                    $el.selected.text(value);
                    var attr = ($el.select.find("option[value=" + value + "]").length > 0)? "value" : "rel";
                    $el.select[0].selectedIndex = $el.select.find("option").index( $el.select.find("option[" + attr + "=" + value + "]") ); // IE7 Workaround
                    //$el.select.val(value).trigger("change");
                });
            break;

            case "input":
                var nodeType = $el.attr("type");
                switch(nodeType){
                    case "radio":
                        $el = $el.parent();
                        $el.radio = $el.children("input[type=radio]");
                        $el.name = $el.radio.attr("name");
                        $el.attr("rel", $el.name);
                        if($el.radio[0].checked) $el.addClass("active");
                        $el.toggle = function(){
                            $("[rel=" + $el.name + "]").removeClass("active");
                            $el.addClass("active");
                            $el.radio[0].checked = "checked";
                        };
                        $el.bind("click change", function(e){
                            if($(this).hasClass("active")) return;
                            $el.toggle();
                            $el.radio.trigger("change");
                        });
                    break;
                    case "checkbox":
                        $el = $el.parent();
                        $el.checkbox = $el.children("input[type=checkbox]");

                        if($el.checkbox[0].checked) {
                            $el.addClass("active");
                        }

                        $el.toggle = function(){
                            $el.toggleClass("active");
                            if($el.hasClass('active')) {
                                $el.checkbox[0].checked = "checked";
                            }else {
                                $el.checkbox[0].checked = "";
                            }
                        };
                        $el.bind("click", function(e){
                            console.log(e.target.className);
                            if(e.target.className != "rules") {
                                $el.toggle();
                                $el.checkbox.trigger("change");
                            }
                        });
                    break;
                }
            break;

            // this is for simple dropdowns
            case "div": case "li":
                $el.click(function(e){
                    $el.offclick(function(e){
                        $el.removeClass("active");
                    });
                    $(this).toggleClass("active");
                });
            break;
        }
    });
    return this;
};

jQuery.fn.offclick = function(callback, forceClose){
    this.each(function(i, el){
        var $el = $(el);
        if(!!($el.data("offclick"))) return;
        $el.offTargetTrigger = function(e){
            if(forceClose){ if($.isFunction(callback)) callback(e); }
            e.stopPropagation();
            var isOffTarget = !(!!($(e.target).parents("[class='" + $el.attr("class") + "']").length) || (e.target == $el[0]));
            if(!isOffTarget) return;
            if($.isFunction(callback)) callback(e);
            $(document).unbind("click", $el.offTargetTrigger);
            $el.removeData("offclick");
        };
        $(document).bind("click", $el.offTargetTrigger);
        $el.data("offclick", true);
    });
};
