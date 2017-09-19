"use strict";

(function () {
    //Breakpoints
    var charlie = 500;
    var delta = 700;
    var echo = 900;

    //Master click handler
    window.addEventListener("click", clickActions, false);
    /*
    window.addEventListener("resize", resizeActions, false);

    function resizeActions(e){
      if(window.innerWidth < 500){
         let m = document.querySelector('.MOD_MENU_Nav');
        m.style.overflow = "hidden";
         }
    }*/

    function clickActions(e) {
        var el = e.target;

        //if clicked on child (image) of a lightbox - MODULISE THIS!
        var lightboxLink = isChildOf(el, "AP_lightbox");
        if (lightboxLink) {
            e.preventDefault();
            //send full res image url to lightbx
            MODULE_LIGHTBOX.lightboxCreate(lightboxLink, lightboxLink.href);
        }

        //if a submenu toggle button was clicked
        if (el.classList.contains("subMenuToggle")) {
            //grab the UL that is the neighbour of the submenu toggle button
            var submenu = el.previousElementSibling;
            if (submenu.tagName === "UL") {
                //toggle the submenu
                MODULE_MENU.toggleMenu(null, submenu);
                //set parent UL to height 'auto' so that the single column mbile menu grows with the opening of the submenu drawers
                var parentUl = isChildOf(submenu, "AP_Menu_List");
                if (parentUl && window.innerWidth < charlie) {
                    parentUl.style.overflow = "visible";
                }
            }
        }
        //if an accordion tab is clicked
        if (el.classList.contains("AP_accordion_tab")) {
            MODULE_ACCORDION.accordionManager(el);
        }
    }

    //=============================================

    //UTILITY createEl, creates and returns a dom element using supplied argument details el:element type i.e. 'div'. classes:the classnames. parent:the parent element. id:the id of the element. content:text content if requires a textnode. imgsrc:source of image if we're created an img element.
    function createEl(el, classes, parent, id, content, imgsrc, href, title) {
        var newEl = document.createElement(el);
        //class
        if (classes) {
            var c = document.createAttribute("class");
            c.value = classes;
            newEl.setAttributeNode(c);
        }
        //data attributes
        if (id) {
            var d = document.createAttribute("data-module-id");
            d.value = id;
            newEl.setAttributeNode(d);
        }
        //text content
        if (content) {
            var t = document.createTextNode(content);
            newEl.appendChild(t);
        }
        if (imgsrc) {
            var i = document.createAttribute("src");
            i.value = imgsrc;
            newEl.setAttributeNode(i);
        }
        parent.appendChild(newEl);
        return newEl;
    } //END createEl

    //UTILITY isChildOf, If the supplied element 'el' is a descendant of an element with the classname of 'classTerm' return the element with the classname of 'classTerm', otherwise return false.
    function isChildOf(el, classTerm) {
        if (el.parentElement === null) {
            return false;
        }
        while (!el.parentElement.classList.contains(classTerm) && el !== null) {
            //now make el equal its parent.
            el = el.parentElement;
            //if el's parent NOW equals null, it means we're ne away from the root so return false, becasue we couldn't find any matches for classTerm.
            if (el.parentElement === null) {
                return false;
            }
        }
        return el.parentElement;
    }

    //JAVASCRIPT MODULES FOR DETACHED COMPONENTS
    var MODULE_MENU = function () {
        //Menu 1
        //convert nodelist to array for MS Edge fix
        var MOD_MENU_Button = [].slice.call(document.querySelectorAll(".MOD_MENU_Button"));
        MOD_MENU_Button.forEach(function (i) {
            i.addEventListener("click", toggleMenu);
        });

        function toggleMenu(event, el) {
            //if we've clicked a main menu burger button, make 'el' the main Menu_List of that menu
            //IMPROVEMENT: UTILITY FUNCTION THAT FETCHES MATCHING NEIGHBOURING NODES INSTEAD OF RELYING ON THE BELOW THAT AP_Menu_List IS THE VERY NEXT ELEMENT.
            if (event !== null && this.nextElementSibling.className === "AP_Menu_List") {
                el = this.nextElementSibling;
            }
            var heightPixels = el.style.height;
            var heightInt = heightPixels.substr(0, heightPixels.length - 2);
            //if the height is greater than 0, then we need to close the menu:
            if (heightInt > 0) {
                el.style.overflow = "hidden";
                el.style.height = "0px";
            } else {
                el.style.height = el.scrollHeight + "px";
            }
        }

        //Create the submenu buttons for menu1
        //grab 'li' children
        var MOD_MENU_Li = document.querySelectorAll(".MOD_MENU_Nav ul li");
        for (var _iterator = Array.from(MOD_MENU_Li), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var li = _ref;

            var subMenu = li.getElementsByTagName("ul");
            //if there is a submenu present
            if (subMenu.length > 0) {
                li.classList.add("hasSubmenu");
                var subMenuToggle = createEl("button", "subMenuToggle", li, null, "▼");
                subMenuToggle.setAttribute("aria-label", "Open Submenu");
                subMenuToggle.setAttribute("title", "Open Submenu");
            }
        }
        return { toggleMenu: toggleMenu };
    }();
    var MODULE_LIGHTBOX = function () {
        //Lightbox
        function lightboxCreate(aTag, imgsrc) {
            //make sure lightbox isn't open already
            if (document.querySelector(".AP_ligtbox_window")) {
                return;
            }

            var lb = createEl("div", "AP_ligtbox_window", document.body, null, null, null);
            lb.addEventListener("click", closeLightbox, false);

            var lbImg = createEl("div", "AP_ligtbox_img", lb);
            lbImg.style.backgroundImage = "url(" + imgsrc + ")";
            lbImg.setAttribute("role", "img");

            //Close button
            var closeBtn = createEl("button", "AP_ligtbox_close", lbImg, null, "×");
            closeBtn.setAttribute("aria-label", "Close");
            closeBtn.setAttribute("title", "Close");
            closeBtn.setAttribute("autofocus", "autofocus");

            //if there is a figcaption present, lets use it
            if (aTag.querySelector("figcaption")) {
                var caption = aTag.querySelector("figcaption").textContent;
                var captionEl = createEl("p", "AP_lightbox_Caption", lbImg, null, caption);
                lbImg.setAttribute("aria-label", caption);
                //if adding aria-label to img, then add aria-hidden to the p tag to prevent duplication
                captionEl.setAttribute("aria-hidden", true);
            }

            //remove lightbox
            function closeLightbox() {
                while (lb.firstChild) {
                    lb.removeChild(lb.firstChild);
                }
                lb.parentNode.removeChild(lb);
            }
        }
        return { lightboxCreate: lightboxCreate };
    }(); //END MODULE_LIGHTBOX

    //Accordion
    var MODULE_ACCORDION = function () {
        // setAutoTimer will hold the setTimeout timer for switching the panels height to 'auto' when the CSS transition has finished. It is an object as it needs to be accessible throughout this module.
        var setAutoTimer = {};
        var MODULE_ACCORDION_Panels = document.querySelectorAll(".AP_accordion_panel");
        //collapse all tab panels to begin with
        for (var _iterator2 = Array.from(MODULE_ACCORDION_Panels), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
            var _ref2;

            if (_isArray2) {
                if (_i2 >= _iterator2.length) break;
                _ref2 = _iterator2[_i2++];
            } else {
                _i2 = _iterator2.next();
                if (_i2.done) break;
                _ref2 = _i2.value;
            }

            var i = _ref2;

            i.style.height = 0;
        }
        //accordionManager is called whenever an accordion tab is clicked
        function accordionManager(el) {
            if (el.nextElementSibling.classList.contains("AP_accordion_panel")) {
                (function () {
                    //toggle .open class on clicked tab
                    el.classList.toggle("open");
                    //toggle height of accordion panel
                    var panel = el.nextElementSibling;
                    if (parseInt(panel.style.height, 10) > 0 || panel.style.height === "auto") {
                        //When we close the draws we need make sure the height is an actual number, not "auto", this is because CSS transitions can't animate from a value of "auto".  First we cancel any timers that are waiting 0.3s for the CSS transition to finish.
                        clearTimeout(setAutoTimer.timer);
                        // Second, we set the current style height to the same value as the scrollheight.
                        panel.style.height = panel.scrollHeight + "px";

                        // Third, we create a promise to listen for when the style height matches the scrollHeight value. Without the promise this would all happen in a split second and the CSS will begin animating from "auto" and not the value of scrollHeight.
                        var p = new Promise(function (resolve, reject) {
                            if (panel.style.height === panel.scrollHeight + "px") {
                                resolve();
                            }
                        });

                        p.then(function () {
                            panel.style.height = "0";
                        });
                    } else {
                        panel.style.height = panel.scrollHeight + "px";
                        //wait 0.3s for CSS transition to finish before settings height to "auto"
                        setAutoTimer.timer = setTimeout(function () {
                            panel.style.height = "auto";
                        }, 300);
                    }
                })();
            }
        }
        return { accordionManager: accordionManager };
    }();
})(); //END MAIN IIFE
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuKGZ1bmN0aW9uICgpIHtcbiAgICAvL0JyZWFrcG9pbnRzXG4gICAgdmFyIGNoYXJsaWUgPSA1MDA7XG4gICAgdmFyIGRlbHRhID0gNzAwO1xuICAgIHZhciBlY2hvID0gOTAwO1xuXG4gICAgLy9NYXN0ZXIgY2xpY2sgaGFuZGxlclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xpY2tBY3Rpb25zLCBmYWxzZSk7XG4gICAgLypcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCByZXNpemVBY3Rpb25zLCBmYWxzZSk7XG5cbiAgICBmdW5jdGlvbiByZXNpemVBY3Rpb25zKGUpe1xuICAgICAgaWYod2luZG93LmlubmVyV2lkdGggPCA1MDApe1xuICAgICAgICAgbGV0IG0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuTU9EX01FTlVfTmF2Jyk7XG4gICAgICAgIG0uc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICAgICAgICAgfVxuICAgIH0qL1xuXG4gICAgZnVuY3Rpb24gY2xpY2tBY3Rpb25zKGUpIHtcbiAgICAgICAgdmFyIGVsID0gZS50YXJnZXQ7XG5cbiAgICAgICAgLy9pZiBjbGlja2VkIG9uIGNoaWxkIChpbWFnZSkgb2YgYSBsaWdodGJveCAtIE1PRFVMSVNFIFRISVMhXG4gICAgICAgIHZhciBsaWdodGJveExpbmsgPSBpc0NoaWxkT2YoZWwsIFwiQVBfbGlnaHRib3hcIik7XG4gICAgICAgIGlmIChsaWdodGJveExpbmspIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIC8vc2VuZCBmdWxsIHJlcyBpbWFnZSB1cmwgdG8gbGlnaHRieFxuICAgICAgICAgICAgTU9EVUxFX0xJR0hUQk9YLmxpZ2h0Ym94Q3JlYXRlKGxpZ2h0Ym94TGluaywgbGlnaHRib3hMaW5rLmhyZWYpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9pZiBhIHN1Ym1lbnUgdG9nZ2xlIGJ1dHRvbiB3YXMgY2xpY2tlZFxuICAgICAgICBpZiAoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwic3ViTWVudVRvZ2dsZVwiKSkge1xuICAgICAgICAgICAgLy9ncmFiIHRoZSBVTCB0aGF0IGlzIHRoZSBuZWlnaGJvdXIgb2YgdGhlIHN1Ym1lbnUgdG9nZ2xlIGJ1dHRvblxuICAgICAgICAgICAgdmFyIHN1Ym1lbnUgPSBlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgaWYgKHN1Ym1lbnUudGFnTmFtZSA9PT0gXCJVTFwiKSB7XG4gICAgICAgICAgICAgICAgLy90b2dnbGUgdGhlIHN1Ym1lbnVcbiAgICAgICAgICAgICAgICBNT0RVTEVfTUVOVS50b2dnbGVNZW51KG51bGwsIHN1Ym1lbnUpO1xuICAgICAgICAgICAgICAgIC8vc2V0IHBhcmVudCBVTCB0byBoZWlnaHQgJ2F1dG8nIHNvIHRoYXQgdGhlIHNpbmdsZSBjb2x1bW4gbWJpbGUgbWVudSBncm93cyB3aXRoIHRoZSBvcGVuaW5nIG9mIHRoZSBzdWJtZW51IGRyYXdlcnNcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50VWwgPSBpc0NoaWxkT2Yoc3VibWVudSwgXCJBUF9NZW51X0xpc3RcIik7XG4gICAgICAgICAgICAgICAgaWYgKHBhcmVudFVsICYmIHdpbmRvdy5pbm5lcldpZHRoIDwgY2hhcmxpZSkge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRVbC5zdHlsZS5vdmVyZmxvdyA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL2lmIGFuIGFjY29yZGlvbiB0YWIgaXMgY2xpY2tlZFxuICAgICAgICBpZiAoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiQVBfYWNjb3JkaW9uX3RhYlwiKSkge1xuICAgICAgICAgICAgTU9EVUxFX0FDQ09SRElPTi5hY2NvcmRpb25NYW5hZ2VyKGVsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAvL1VUSUxJVFkgY3JlYXRlRWwsIGNyZWF0ZXMgYW5kIHJldHVybnMgYSBkb20gZWxlbWVudCB1c2luZyBzdXBwbGllZCBhcmd1bWVudCBkZXRhaWxzIGVsOmVsZW1lbnQgdHlwZSBpLmUuICdkaXYnLiBjbGFzc2VzOnRoZSBjbGFzc25hbWVzLiBwYXJlbnQ6dGhlIHBhcmVudCBlbGVtZW50LiBpZDp0aGUgaWQgb2YgdGhlIGVsZW1lbnQuIGNvbnRlbnQ6dGV4dCBjb250ZW50IGlmIHJlcXVpcmVzIGEgdGV4dG5vZGUuIGltZ3NyYzpzb3VyY2Ugb2YgaW1hZ2UgaWYgd2UncmUgY3JlYXRlZCBhbiBpbWcgZWxlbWVudC5cbiAgICBmdW5jdGlvbiBjcmVhdGVFbChlbCwgY2xhc3NlcywgcGFyZW50LCBpZCwgY29udGVudCwgaW1nc3JjLCBocmVmLCB0aXRsZSkge1xuICAgICAgICB2YXIgbmV3RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsKTtcbiAgICAgICAgLy9jbGFzc1xuICAgICAgICBpZiAoY2xhc3Nlcykge1xuICAgICAgICAgICAgdmFyIGMgPSBkb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUoXCJjbGFzc1wiKTtcbiAgICAgICAgICAgIGMudmFsdWUgPSBjbGFzc2VzO1xuICAgICAgICAgICAgbmV3RWwuc2V0QXR0cmlidXRlTm9kZShjKTtcbiAgICAgICAgfVxuICAgICAgICAvL2RhdGEgYXR0cmlidXRlc1xuICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgIHZhciBkID0gZG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKFwiZGF0YS1tb2R1bGUtaWRcIik7XG4gICAgICAgICAgICBkLnZhbHVlID0gaWQ7XG4gICAgICAgICAgICBuZXdFbC5zZXRBdHRyaWJ1dGVOb2RlKGQpO1xuICAgICAgICB9XG4gICAgICAgIC8vdGV4dCBjb250ZW50XG4gICAgICAgIGlmIChjb250ZW50KSB7XG4gICAgICAgICAgICB2YXIgdCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNvbnRlbnQpO1xuICAgICAgICAgICAgbmV3RWwuYXBwZW5kQ2hpbGQodCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGltZ3NyYykge1xuICAgICAgICAgICAgdmFyIGkgPSBkb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUoXCJzcmNcIik7XG4gICAgICAgICAgICBpLnZhbHVlID0gaW1nc3JjO1xuICAgICAgICAgICAgbmV3RWwuc2V0QXR0cmlidXRlTm9kZShpKTtcbiAgICAgICAgfVxuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQobmV3RWwpO1xuICAgICAgICByZXR1cm4gbmV3RWw7XG4gICAgfSAvL0VORCBjcmVhdGVFbFxuXG4gICAgLy9VVElMSVRZIGlzQ2hpbGRPZiwgSWYgdGhlIHN1cHBsaWVkIGVsZW1lbnQgJ2VsJyBpcyBhIGRlc2NlbmRhbnQgb2YgYW4gZWxlbWVudCB3aXRoIHRoZSBjbGFzc25hbWUgb2YgJ2NsYXNzVGVybScgcmV0dXJuIHRoZSBlbGVtZW50IHdpdGggdGhlIGNsYXNzbmFtZSBvZiAnY2xhc3NUZXJtJywgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cbiAgICBmdW5jdGlvbiBpc0NoaWxkT2YoZWwsIGNsYXNzVGVybSkge1xuICAgICAgICBpZiAoZWwucGFyZW50RWxlbWVudCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlICghZWwucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NUZXJtKSAmJiBlbCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgLy9ub3cgbWFrZSBlbCBlcXVhbCBpdHMgcGFyZW50LlxuICAgICAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgLy9pZiBlbCdzIHBhcmVudCBOT1cgZXF1YWxzIG51bGwsIGl0IG1lYW5zIHdlJ3JlIG5lIGF3YXkgZnJvbSB0aGUgcm9vdCBzbyByZXR1cm4gZmFsc2UsIGJlY2FzdWUgd2UgY291bGRuJ3QgZmluZCBhbnkgbWF0Y2hlcyBmb3IgY2xhc3NUZXJtLlxuICAgICAgICAgICAgaWYgKGVsLnBhcmVudEVsZW1lbnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsLnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLy9KQVZBU0NSSVBUIE1PRFVMRVMgRk9SIERFVEFDSEVEIENPTVBPTkVOVFNcbiAgICB2YXIgTU9EVUxFX01FTlUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vTWVudSAxXG4gICAgICAgIC8vY29udmVydCBub2RlbGlzdCB0byBhcnJheSBmb3IgTVMgRWRnZSBmaXhcbiAgICAgICAgdmFyIE1PRF9NRU5VX0J1dHRvbiA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5NT0RfTUVOVV9CdXR0b25cIikpO1xuICAgICAgICBNT0RfTUVOVV9CdXR0b24uZm9yRWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgaS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdG9nZ2xlTWVudSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZU1lbnUoZXZlbnQsIGVsKSB7XG4gICAgICAgICAgICAvL2lmIHdlJ3ZlIGNsaWNrZWQgYSBtYWluIG1lbnUgYnVyZ2VyIGJ1dHRvbiwgbWFrZSAnZWwnIHRoZSBtYWluIE1lbnVfTGlzdCBvZiB0aGF0IG1lbnVcbiAgICAgICAgICAgIC8vSU1QUk9WRU1FTlQ6IFVUSUxJVFkgRlVOQ1RJT04gVEhBVCBGRVRDSEVTIE1BVENISU5HIE5FSUdIQk9VUklORyBOT0RFUyBJTlNURUFEIE9GIFJFTFlJTkcgT04gVEhFIEJFTE9XIFRIQVQgQVBfTWVudV9MaXN0IElTIFRIRSBWRVJZIE5FWFQgRUxFTUVOVC5cbiAgICAgICAgICAgIGlmIChldmVudCAhPT0gbnVsbCAmJiB0aGlzLm5leHRFbGVtZW50U2libGluZy5jbGFzc05hbWUgPT09IFwiQVBfTWVudV9MaXN0XCIpIHtcbiAgICAgICAgICAgICAgICBlbCA9IHRoaXMubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGhlaWdodFBpeGVscyA9IGVsLnN0eWxlLmhlaWdodDtcbiAgICAgICAgICAgIHZhciBoZWlnaHRJbnQgPSBoZWlnaHRQaXhlbHMuc3Vic3RyKDAsIGhlaWdodFBpeGVscy5sZW5ndGggLSAyKTtcbiAgICAgICAgICAgIC8vaWYgdGhlIGhlaWdodCBpcyBncmVhdGVyIHRoYW4gMCwgdGhlbiB3ZSBuZWVkIHRvIGNsb3NlIHRoZSBtZW51OlxuICAgICAgICAgICAgaWYgKGhlaWdodEludCA+IDApIHtcbiAgICAgICAgICAgICAgICBlbC5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgZWwuc3R5bGUuaGVpZ2h0ID0gXCIwcHhcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWwuc3R5bGUuaGVpZ2h0ID0gZWwuc2Nyb2xsSGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9DcmVhdGUgdGhlIHN1Ym1lbnUgYnV0dG9ucyBmb3IgbWVudTFcbiAgICAgICAgLy9ncmFiICdsaScgY2hpbGRyZW5cbiAgICAgICAgdmFyIE1PRF9NRU5VX0xpID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5NT0RfTUVOVV9OYXYgdWwgbGlcIik7XG4gICAgICAgIGZvciAodmFyIF9pdGVyYXRvciA9IEFycmF5LmZyb20oTU9EX01FTlVfTGkpLCBfaXNBcnJheSA9IEFycmF5LmlzQXJyYXkoX2l0ZXJhdG9yKSwgX2kgPSAwLCBfaXRlcmF0b3IgPSBfaXNBcnJheSA/IF9pdGVyYXRvciA6IF9pdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgICAgdmFyIF9yZWY7XG5cbiAgICAgICAgICAgIGlmIChfaXNBcnJheSkge1xuICAgICAgICAgICAgICAgIGlmIChfaSA+PSBfaXRlcmF0b3IubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgICAgICBfcmVmID0gX2l0ZXJhdG9yW19pKytdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfaSA9IF9pdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgaWYgKF9pLmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgICAgIF9yZWYgPSBfaS52YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGxpID0gX3JlZjtcblxuICAgICAgICAgICAgdmFyIHN1Yk1lbnUgPSBsaS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInVsXCIpO1xuICAgICAgICAgICAgLy9pZiB0aGVyZSBpcyBhIHN1Ym1lbnUgcHJlc2VudFxuICAgICAgICAgICAgaWYgKHN1Yk1lbnUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGxpLmNsYXNzTGlzdC5hZGQoXCJoYXNTdWJtZW51XCIpO1xuICAgICAgICAgICAgICAgIHZhciBzdWJNZW51VG9nZ2xlID0gY3JlYXRlRWwoXCJidXR0b25cIiwgXCJzdWJNZW51VG9nZ2xlXCIsIGxpLCBudWxsLCBcIuKWvFwiKTtcbiAgICAgICAgICAgICAgICBzdWJNZW51VG9nZ2xlLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJPcGVuIFN1Ym1lbnVcIik7XG4gICAgICAgICAgICAgICAgc3ViTWVudVRvZ2dsZS5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBcIk9wZW4gU3VibWVudVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyB0b2dnbGVNZW51OiB0b2dnbGVNZW51IH07XG4gICAgfSgpO1xuICAgIHZhciBNT0RVTEVfTElHSFRCT1ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vTGlnaHRib3hcbiAgICAgICAgZnVuY3Rpb24gbGlnaHRib3hDcmVhdGUoYVRhZywgaW1nc3JjKSB7XG4gICAgICAgICAgICAvL21ha2Ugc3VyZSBsaWdodGJveCBpc24ndCBvcGVuIGFscmVhZHlcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLkFQX2xpZ3Rib3hfd2luZG93XCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbGIgPSBjcmVhdGVFbChcImRpdlwiLCBcIkFQX2xpZ3Rib3hfd2luZG93XCIsIGRvY3VtZW50LmJvZHksIG51bGwsIG51bGwsIG51bGwpO1xuICAgICAgICAgICAgbGIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlTGlnaHRib3gsIGZhbHNlKTtcblxuICAgICAgICAgICAgdmFyIGxiSW1nID0gY3JlYXRlRWwoXCJkaXZcIiwgXCJBUF9saWd0Ym94X2ltZ1wiLCBsYik7XG4gICAgICAgICAgICBsYkltZy5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybChcIiArIGltZ3NyYyArIFwiKVwiO1xuICAgICAgICAgICAgbGJJbWcuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcImltZ1wiKTtcblxuICAgICAgICAgICAgLy9DbG9zZSBidXR0b25cbiAgICAgICAgICAgIHZhciBjbG9zZUJ0biA9IGNyZWF0ZUVsKFwiYnV0dG9uXCIsIFwiQVBfbGlndGJveF9jbG9zZVwiLCBsYkltZywgbnVsbCwgXCLDl1wiKTtcbiAgICAgICAgICAgIGNsb3NlQnRuLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJDbG9zZVwiKTtcbiAgICAgICAgICAgIGNsb3NlQnRuLnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIFwiQ2xvc2VcIik7XG4gICAgICAgICAgICBjbG9zZUJ0bi5zZXRBdHRyaWJ1dGUoXCJhdXRvZm9jdXNcIiwgXCJhdXRvZm9jdXNcIik7XG5cbiAgICAgICAgICAgIC8vaWYgdGhlcmUgaXMgYSBmaWdjYXB0aW9uIHByZXNlbnQsIGxldHMgdXNlIGl0XG4gICAgICAgICAgICBpZiAoYVRhZy5xdWVyeVNlbGVjdG9yKFwiZmlnY2FwdGlvblwiKSkge1xuICAgICAgICAgICAgICAgIHZhciBjYXB0aW9uID0gYVRhZy5xdWVyeVNlbGVjdG9yKFwiZmlnY2FwdGlvblwiKS50ZXh0Q29udGVudDtcbiAgICAgICAgICAgICAgICB2YXIgY2FwdGlvbkVsID0gY3JlYXRlRWwoXCJwXCIsIFwiQVBfbGlnaHRib3hfQ2FwdGlvblwiLCBsYkltZywgbnVsbCwgY2FwdGlvbik7XG4gICAgICAgICAgICAgICAgbGJJbWcuc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBjYXB0aW9uKTtcbiAgICAgICAgICAgICAgICAvL2lmIGFkZGluZyBhcmlhLWxhYmVsIHRvIGltZywgdGhlbiBhZGQgYXJpYS1oaWRkZW4gdG8gdGhlIHAgdGFnIHRvIHByZXZlbnQgZHVwbGljYXRpb25cbiAgICAgICAgICAgICAgICBjYXB0aW9uRWwuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vcmVtb3ZlIGxpZ2h0Ym94XG4gICAgICAgICAgICBmdW5jdGlvbiBjbG9zZUxpZ2h0Ym94KCkge1xuICAgICAgICAgICAgICAgIHdoaWxlIChsYi5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxiLnJlbW92ZUNoaWxkKGxiLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsYi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGxiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBsaWdodGJveENyZWF0ZTogbGlnaHRib3hDcmVhdGUgfTtcbiAgICB9KCk7IC8vRU5EIE1PRFVMRV9MSUdIVEJPWFxuXG4gICAgLy9BY2NvcmRpb25cbiAgICB2YXIgTU9EVUxFX0FDQ09SRElPTiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gc2V0QXV0b1RpbWVyIHdpbGwgaG9sZCB0aGUgc2V0VGltZW91dCB0aW1lciBmb3Igc3dpdGNoaW5nIHRoZSBwYW5lbHMgaGVpZ2h0IHRvICdhdXRvJyB3aGVuIHRoZSBDU1MgdHJhbnNpdGlvbiBoYXMgZmluaXNoZWQuIEl0IGlzIGFuIG9iamVjdCBhcyBpdCBuZWVkcyB0byBiZSBhY2Nlc3NpYmxlIHRocm91Z2hvdXQgdGhpcyBtb2R1bGUuXG4gICAgICAgIHZhciBzZXRBdXRvVGltZXIgPSB7fTtcbiAgICAgICAgdmFyIE1PRFVMRV9BQ0NPUkRJT05fUGFuZWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5BUF9hY2NvcmRpb25fcGFuZWxcIik7XG4gICAgICAgIC8vY29sbGFwc2UgYWxsIHRhYiBwYW5lbHMgdG8gYmVnaW4gd2l0aFxuICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IyID0gQXJyYXkuZnJvbShNT0RVTEVfQUNDT1JESU9OX1BhbmVscyksIF9pc0FycmF5MiA9IEFycmF5LmlzQXJyYXkoX2l0ZXJhdG9yMiksIF9pMiA9IDAsIF9pdGVyYXRvcjIgPSBfaXNBcnJheTIgPyBfaXRlcmF0b3IyIDogX2l0ZXJhdG9yMltTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgICAgdmFyIF9yZWYyO1xuXG4gICAgICAgICAgICBpZiAoX2lzQXJyYXkyKSB7XG4gICAgICAgICAgICAgICAgaWYgKF9pMiA+PSBfaXRlcmF0b3IyLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgX3JlZjIgPSBfaXRlcmF0b3IyW19pMisrXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX2kyID0gX2l0ZXJhdG9yMi5uZXh0KCk7XG4gICAgICAgICAgICAgICAgaWYgKF9pMi5kb25lKSBicmVhaztcbiAgICAgICAgICAgICAgICBfcmVmMiA9IF9pMi52YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGkgPSBfcmVmMjtcblxuICAgICAgICAgICAgaS5zdHlsZS5oZWlnaHQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIC8vYWNjb3JkaW9uTWFuYWdlciBpcyBjYWxsZWQgd2hlbmV2ZXIgYW4gYWNjb3JkaW9uIHRhYiBpcyBjbGlja2VkXG4gICAgICAgIGZ1bmN0aW9uIGFjY29yZGlvbk1hbmFnZXIoZWwpIHtcbiAgICAgICAgICAgIGlmIChlbC5uZXh0RWxlbWVudFNpYmxpbmcuY2xhc3NMaXN0LmNvbnRhaW5zKFwiQVBfYWNjb3JkaW9uX3BhbmVsXCIpKSB7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy90b2dnbGUgLm9wZW4gY2xhc3Mgb24gY2xpY2tlZCB0YWJcbiAgICAgICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnRvZ2dsZShcIm9wZW5cIik7XG4gICAgICAgICAgICAgICAgICAgIC8vdG9nZ2xlIGhlaWdodCBvZiBhY2NvcmRpb24gcGFuZWxcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhbmVsID0gZWwubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VJbnQocGFuZWwuc3R5bGUuaGVpZ2h0LCAxMCkgPiAwIHx8IHBhbmVsLnN0eWxlLmhlaWdodCA9PT0gXCJhdXRvXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vV2hlbiB3ZSBjbG9zZSB0aGUgZHJhd3Mgd2UgbmVlZCBtYWtlIHN1cmUgdGhlIGhlaWdodCBpcyBhbiBhY3R1YWwgbnVtYmVyLCBub3QgXCJhdXRvXCIsIHRoaXMgaXMgYmVjYXVzZSBDU1MgdHJhbnNpdGlvbnMgY2FuJ3QgYW5pbWF0ZSBmcm9tIGEgdmFsdWUgb2YgXCJhdXRvXCIuICBGaXJzdCB3ZSBjYW5jZWwgYW55IHRpbWVycyB0aGF0IGFyZSB3YWl0aW5nIDAuM3MgZm9yIHRoZSBDU1MgdHJhbnNpdGlvbiB0byBmaW5pc2guXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoc2V0QXV0b1RpbWVyLnRpbWVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNlY29uZCwgd2Ugc2V0IHRoZSBjdXJyZW50IHN0eWxlIGhlaWdodCB0byB0aGUgc2FtZSB2YWx1ZSBhcyB0aGUgc2Nyb2xsaGVpZ2h0LlxuICAgICAgICAgICAgICAgICAgICAgICAgcGFuZWwuc3R5bGUuaGVpZ2h0ID0gcGFuZWwuc2Nyb2xsSGVpZ2h0ICsgXCJweFwiO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGlyZCwgd2UgY3JlYXRlIGEgcHJvbWlzZSB0byBsaXN0ZW4gZm9yIHdoZW4gdGhlIHN0eWxlIGhlaWdodCBtYXRjaGVzIHRoZSBzY3JvbGxIZWlnaHQgdmFsdWUuIFdpdGhvdXQgdGhlIHByb21pc2UgdGhpcyB3b3VsZCBhbGwgaGFwcGVuIGluIGEgc3BsaXQgc2Vjb25kIGFuZCB0aGUgQ1NTIHdpbGwgYmVnaW4gYW5pbWF0aW5nIGZyb20gXCJhdXRvXCIgYW5kIG5vdCB0aGUgdmFsdWUgb2Ygc2Nyb2xsSGVpZ2h0LlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHAgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhbmVsLnN0eWxlLmhlaWdodCA9PT0gcGFuZWwuc2Nyb2xsSGVpZ2h0ICsgXCJweFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYW5lbC5zdHlsZS5oZWlnaHQgPSBcIjBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFuZWwuc3R5bGUuaGVpZ2h0ID0gcGFuZWwuc2Nyb2xsSGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy93YWl0IDAuM3MgZm9yIENTUyB0cmFuc2l0aW9uIHRvIGZpbmlzaCBiZWZvcmUgc2V0dGluZ3MgaGVpZ2h0IHRvIFwiYXV0b1wiXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRBdXRvVGltZXIudGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYW5lbC5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDMwMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGFjY29yZGlvbk1hbmFnZXI6IGFjY29yZGlvbk1hbmFnZXIgfTtcbiAgICB9KCk7XG59KSgpOyAvL0VORCBNQUlOIElJRkUiXX0=
