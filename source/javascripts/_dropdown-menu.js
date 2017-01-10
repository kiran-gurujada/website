jQuery(document).ready(function ($) {
  function DropdownMenu (element) {
    this.element = element;
    this.mainNavigation = this.element.find('.main-nav');
    this.mainNavigationItems = this.mainNavigation.find('.has-dropdown');
    this.dropdownArrow = this.element.find('.dropdown-arrow');
    this.dropdownList = this.element.find('.dropdown-list');
    this.dropdownWrappers = this.dropdownList.find('.dropdown');
    this.dropdownItems = this.dropdownList.find('.content');
    this.dropdownBg = this.dropdownList.find('.bg-layer');
    this.mq = this.checkMq();
    this.bindEvents();
  }

  DropdownMenu.prototype.checkMq = function () {
    // Check screen size
    return window.getComputedStyle(this.element.get(0), '::before')
      .getPropertyValue('content')
      .replace(/'/g, '')
      .replace(/"/g, '')
      .split(', ');
  };

  DropdownMenu.prototype.bindEvents = function () {
    var self = this;

    // Hover over an item in the main navigation
    this.mainNavigationItems.mouseenter(function (event) {
      // Hover over one of the nav items -> show dropdown
      self.showDropdown($(this));
    }).mouseleave(function () {
      var menuItem = this;
      setTimeout(function () {
        // If not hovering over a nav item or a dropdown -> hide dropdown
        if (self.mainNavigation.find('.has-dropdown:hover').length === 0 &&
            self.element.find('.dropdown-list:hover').length === 0) {
          self.hideDropdown($(menuItem));
        }
      }, 50);
    });

    // Hover over the dropdown
    this.dropdownList.mouseleave(function () {
      var menuItem = this;
      setTimeout(function () {
        // If not hovering over a dropdown or a nav item -> hide dropdown
        if (self.mainNavigation.find('.has-dropdown:hover').length === 0 &&
            self.element.find('.dropdown-list:hover').length === 0) {
          self.hideDropdown($(menuItem));
        }
      }, 50);
    });

    // Click on item in the main navigation -> open dropdown on touch device
    this.mainNavigationItems.on('touchstart', function (event) {
      var selectedDropdownId = $(this).data('content');
      var selectedDropdown = self.dropdownList.find('#' + selectedDropdownId);
      if (!self.element.hasClass('is-dropdown-visible') ||
          !selectedDropdown.hasClass('active')) {
        event.preventDefault();
        self.showDropdown($(this));
      }
    });

    // On small screens, open navigation clicking on the menu icon
    this.element.on('click', '.nav-trigger', function (event) {
      event.preventDefault();
      self.element.toggleClass('nav-open');
      $('body').toggleClass('no-scroll');
    });
  };

  DropdownMenu.prototype.showDropdown = function (menuItem) {
    this.mq = this.checkMq();
    if (this.mq == 'desktop') {
      var self = this;
      var selectedDropdown = this.dropdownList.find('#' + menuItem.data('content'));
      var selectedDropdownHeight = selectedDropdown.innerHeight();
      var selectedDropdownWidth = selectedDropdown.children('.content').innerWidth();
      var selectedDropdownLeft = menuItem.offset().left + (menuItem.innerWidth() - selectedDropdownWidth) / 2;

      // Update dropdown position and size
      this.updateDropdown(
        selectedDropdown,
        parseInt(selectedDropdownHeight),
        selectedDropdownWidth,
        parseInt(selectedDropdownLeft)
      );

      // Add active class to the proper dropdown item
      this.dropdownWrappers.removeClass('active');
      selectedDropdown.addClass('active').removeClass('move-left move-right')
        .prevAll().addClass('move-left').end().nextAll().addClass('move-right');

      // Add active class to the proper menu item
      this.mainNavigationItems.removeClass('active');
      menuItem.addClass('active');

      // Show the dropdown wrapper if not visible yet
      if (!this.element.hasClass('is-dropdown-visible')) {
        setTimeout(function () {
          self.element.addClass('is-dropdown-visible');
        }, 10);
      }
    }
  };

  DropdownMenu.prototype.updateDropdown = function (dropdownItem, height, width, left) {
    this.dropdownArrow.css({
      transform: 'translate3d(' + (left + width / 2) + 'px, 0, 0)'
    });

    this.dropdownList.css({
      transform: 'translate3d(' + left + 'px, 0, 0)',
      width: width + 'px',
      height: height + 'px'
    });

    this.dropdownBg.css({
      transform: 'scale3d(' + width + ', ' + height + ', 1)'
    });
  };

  DropdownMenu.prototype.hideDropdown = function (menuItem) {
    this.mq = this.checkMq();
    if (this.mq == 'desktop') {
      this.element.removeClass('is-dropdown-visible');

      // Remove active class to the active dropdown item
      this.dropdownWrappers.removeClass('active move-left move-right');

      // Remove active class to the active menu item
      this.mainNavigationItems.removeClass('active');
    }
  };

  DropdownMenu.prototype.resetDropdown = function () {
    this.mq = this.checkMq();
    if (this.mq == 'mobile') {
      this.dropdownList.removeAttr('style');
    }
  };

  var dropdownMenus = [];
  var $dropdownMenus = $('.dropdown-menu');

  if ($dropdownMenus.length > 0) {
    var resizing = false;

    // Create a DropdownMenu instances
    $dropdownMenus.each(function () {
      dropdownMenus.push(new DropdownMenu($(this)));
    });

    // On resize, reset dropdown style property
    updateDropdownPosition();
    $(window).on('resize', function () {
      if (!resizing) {
        resizing =  true;

        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(updateDropdownPosition);
        } else {
          setTimeout(updateDropdownPosition, 300);
        }
      }
    });

    function updateDropdownPosition () {
      dropdownMenus.forEach(function (element) {
        element.resetDropdown();
      });

      resizing = false;
    };
  }
});
