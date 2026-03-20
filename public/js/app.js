/**
 * OpenLab Computer Reservation System
 * @file app.js (rewritten for Express/Handlebars backend)
 * @description Event handlers and fetch API calls only.
 *              All DOM building is now done by Handlebars templates.
 *              No localStorage, no sessionStorage — sessions are server-side.
 */

// =============================================================================
// UTILITY HELPERS
// =============================================================================

/** Format date string "YYYY-MM-DD" to "February 10, 2025" */
function formatDateLong(dateStr) {
  var months = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
  var d = new Date(dateStr);
  return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}


// =============================================================================
// BACKGROUND SLIDESHOW (index, login, register pages)
// =============================================================================

function initBgSlideshow() {
  var $slides = $('.bg-slide');
  if ($slides.length < 2) return;

  var current = 0;
  setInterval(function() {
    $slides.eq(current).removeClass('active');
    current = (current + 1) % $slides.length;
    $slides.eq(current).addClass('active');
  }, 5000);
}


// =============================================================================
// LOGIN PAGE
// =============================================================================

function initLoginPage() {
  var $form = $('.login-form');
  if (!$form.length) return;

  $form.on('submit', function(e) {
    e.preventDefault();
    var email = $('#email').val().trim();
    var password = $('#password').val();

    // Front-end validation
    var $error = $('.login-error');
    if (!$error.length) {
      $form.prepend('<div class="login-error" style="color:#e74c3c;margin-bottom:10px;display:none;"></div>');
      $error = $('.login-error');
    }
    $error.hide().text('');

    if (!email) {
      $error.text('Please enter your email address.').show();
      $('#email').focus();
      return;
    }
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      $error.text('Please enter a valid email address.').show();
      $('#email').focus();
      return;
    }
    if (!password) {
      $error.text('Please enter your password.').show();
      $('#password').focus();
      return;
    }

    var rememberMe = $('#remember').is(':checked');

    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password, rememberMe: rememberMe })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.success) {
        window.location.href = '/dashboard';
      } else {
        $error.text(data.error || 'Invalid email or password.').show();
        $('#password').val('').focus();
      }
    })
    .catch(function() {
      $error.text('Login failed. Please try again.').show();
    });
  });

  $('.forgot-password').on('click', function(e) {
    e.preventDefault();
    var email = prompt('Enter your DLSU email:');
    if (email) {
      alert('Your password cannot be retrieved. Please contact the lab administrator to reset it.');
    }
  });
}


// =============================================================================
// TECHNICIAN LOGIN PAGE
// =============================================================================

function initTechLoginPage() {
  var $form = $('#techLoginForm');
  if (!$form.length) return;

  $form.on('submit', function(e) {
    e.preventDefault();
    var email = $('#email').val().trim();
    var password = $('#password').val();

    // Front-end validation
    var $error = $('.login-error');
    if (!$error.length) {
      $form.prepend('<div class="login-error" style="color:#e74c3c;margin-bottom:10px;display:none;"></div>');
      $error = $('.login-error');
    }
    $error.hide().text('');

    if (!email) {
      $error.text('Please enter your email address.').show();
      $('#email').focus();
      return;
    }
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      $error.text('Please enter a valid email address.').show();
      $('#email').focus();
      return;
    }
    if (!password) {
      $error.text('Please enter your password.').show();
      $('#password').focus();
      return;
    }

    var rememberMe = $('#remember').is(':checked');

    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password, techOnly: true, rememberMe: rememberMe })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.success) {
        window.location.href = '/dashboard';
      } else {
        $error.text(data.error || 'Invalid technician credentials.').show();
        $('#password').val('').focus();
      }
    })
    .catch(function() {
      $error.text('Login failed. Please try again.').show();
    });
  });
}


// =============================================================================
// REGISTER PAGE
// =============================================================================

function initRegisterPage() {
  var $form = $('.register-form');
  if (!$form.length) return;

  $form.on('submit', function(e) {
    e.preventDefault();
    // Front-end validation
    var $error = $('.register-error');
    if (!$error.length) {
      $form.prepend('<div class="register-error" style="color:#e74c3c;margin-bottom:10px;display:none;"></div>');
      $error = $('.register-error');
    }
    $error.hide().text('');

    var firstName = $('#firstName').val().trim();
    var lastName = $('#lastName').val().trim();
    var studentId = $('#studentId').val().trim();
    var email = $('#email').val().trim();
    var college = $('#college').val();
    var accountType = $('#accountType').val();
    var pass = $('#password').val();
    var confirmPass = $('#confirmPassword').val();

    if (!firstName) { $error.text('First name is required.').show(); $('#firstName').focus(); return; }
    if (!lastName) { $error.text('Last name is required.').show(); $('#lastName').focus(); return; }
    if (!/^[0-9]{8}$/.test(studentId)) { $error.text('Student ID must be exactly 8 digits.').show(); $('#studentId').focus(); return; }
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) { $error.text('Please enter a valid email address.').show(); $('#email').focus(); return; }
    if (!college) { $error.text('Please select your college.').show(); $('#college').focus(); return; }
    if (!accountType) { $error.text('Please select an account type.').show(); $('#accountType').focus(); return; }
    if (pass.length < 8) { $error.text('Password must be at least 8 characters.').show(); $('#password').focus(); return; }
    if (pass !== confirmPass) { $error.text('Passwords do not match.').show(); $('#confirmPassword').focus(); return; }

    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        studentId: studentId,
        email: email,
        college: college,
        accountType: accountType,
        password: pass
      })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.success) {
        alert('Registration successful! Welcome to OpenLab.');
        window.location.href = '/dashboard';
      } else {
        $error.text(data.error || 'Registration failed.').show();
      }
    })
    .catch(function() {
      $error.text('Registration failed. Please try again.').show();
    });
  });
}


// =============================================================================
// SIGN OUT
// =============================================================================

function initSignout() {
  $('#signoutBtn').on('click', function(e) {
    e.preventDefault();
    fetch('/api/logout', { method: 'POST' })
    .then(function() {
      window.location.href = '/';
    })
    .catch(function() {
      window.location.href = '/';
    });
  });
}


// =============================================================================
// RESERVE PAGE — SEAT SELECTION & BOOKING
// =============================================================================

function initSeatSelection() {
  var $grid = $('.seat-grid');
  if (!$grid.length) return;

  // --- Helper: get all selected time slot labels ---
  function getSelectedSlots() {
    var slots = [];
    $('#timeslotGrid input:checked').each(function() {
      slots.push($(this).val());
    });
    return slots;
  }

  // --- Helper: update the booking summary ---
  function updateSummary() {
    var slots = getSelectedSlots();
    var seat = $('.seat.selected').attr('data-seat');
    var count = slots.length;

    // Slot count label
    $('#slotCountLabel').text('(' + count + ' selected)');

    // Summary time
    if (count === 0) {
      $('#summaryTime').text('-');
      $('#summaryDuration').text('-');
    } else if (count === 1) {
      $('#summaryTime').text(slots[0]);
      $('#summaryDuration').text('30 min');
    } else {
      // Show first and last
      $('#summaryTime').text(slots[0].split(' - ')[0] + ' - ' + slots[count - 1].split(' - ')[1]);
      $('#summaryDuration').text((count * 30) + ' min (' + count + ' slots)');
    }

    // Enable confirm only if seat + at least 1 slot selected
    var canConfirm = seat && count > 0;
    var editId = $('#confirmBtn').data('edit-id');
    $('#confirmBtn').prop('disabled', !canConfirm)
      .text(canConfirm
        ? (editId ? 'Update Reservation' : 'Confirm ' + count + ' Slot' + (count > 1 ? 's' : ''))
        : (seat ? 'Select Time Slots' : 'Select a Seat to Continue'));
  }

  // --- Time slot chip click (auto-fill consecutive slots) ---
  $('#timeslotGrid').on('change', 'input[type="checkbox"]', function() {
    var $allChips = $('#timeslotGrid .timeslot-chip').not('.disabled');
    var clickedIndex = $allChips.index($(this).closest('.timeslot-chip'));

    if (this.checked) {
      // Find the indices of all currently checked (enabled) slots
      var checkedIndices = [];
      $allChips.each(function(i) {
        if ($(this).find('input').is(':checked')) checkedIndices.push(i);
      });

      if (checkedIndices.length > 1) {
        // Auto-fill: select all slots between the min and max checked index
        var minIdx = Math.min.apply(null, checkedIndices);
        var maxIdx = Math.max.apply(null, checkedIndices);
        $allChips.each(function(i) {
          if (i >= minIdx && i <= maxIdx) {
            $(this).addClass('active');
            $(this).find('input').prop('checked', true);
          }
        });
      } else {
        $(this).closest('.timeslot-chip').addClass('active');
      }
    } else {
      // When unchecking, clear all slots after this one to keep it consecutive
      var uncheckFrom = clickedIndex;
      $allChips.each(function(i) {
        if (i >= uncheckFrom) {
          $(this).removeClass('active');
          $(this).find('input').prop('checked', false);
        }
      });
    }
    updateSummary();
    refreshAvailability();
  });

  // Mark initially selected chips (edit mode)
  $('#timeslotGrid input:checked').each(function() {
    $(this).closest('.timeslot-chip').addClass('active');
  });

  // --- Seat click handler ---
  $grid.on('click', '.seat.available', function() {
    $('.seat.selected').removeClass('selected').addClass('available');
    $(this).removeClass('available').addClass('selected');
    var seatId = $(this).attr('data-seat');
    $('#summarySeat').text(seatId);
    updateSummary();
  });

  // --- Helper: disable past timeslots if selected date is today ---
  function updateTimeslotAvailability() {
    var selectedDate = $('#reserveDate').val();
    var today = new Date().toISOString().split('T')[0];

    if (selectedDate === today) {
      var now = new Date();
      var currentMinutes = now.getHours() * 60 + now.getMinutes();

      $('#timeslotGrid .timeslot-chip').each(function() {
        var slotValue = $(this).attr('data-slot-value');
        if (!slotValue) return;
        // Parse end time from value like "07:00 - 07:30"
        var endPart = slotValue.split(' - ')[1];
        var parts = endPart.split(':');
        var endMinutes = parseInt(parts[0]) * 60 + parseInt(parts[1]);

        if (currentMinutes >= endMinutes) {
          $(this).addClass('disabled');
          $(this).find('input').prop('disabled', true).prop('checked', false);
          $(this).removeClass('active');
        } else {
          $(this).removeClass('disabled');
          $(this).find('input').prop('disabled', false);
        }
      });
    } else {
      // Future date: enable all timeslots
      $('#timeslotGrid .timeslot-chip').each(function() {
        $(this).removeClass('disabled');
        $(this).find('input').prop('disabled', false);
      });
    }
    updateSummary();
  }

  // --- Date change ---
  $('#reserveDate').on('change', function() {
    var val = $(this).val();
    if (val) $('#summaryDate').text(formatDateLong(val));
    updateTimeslotAvailability();
    refreshAvailability();
  });

  // --- Anonymous toggle ---
  $('#anonymousToggle').on('change', function() {
    var isAnon = $(this).is(':checked');
    var $status = $('#summaryAnonStatus');
    if ($status.length === 0) {
      $('.summary-details').append(
        '<div class="summary-item" id="summaryAnonStatus">' +
        '<span class="label">Mode</span><span class="value"></span></div>'
      );
      $status = $('#summaryAnonStatus');
    }
    $status.find('.value').text(isAnon ? 'Anonymous' : 'Public');
  });

  // --- Pre-select seat if editing ---
  var $confirmBtn = $('#confirmBtn');
  var editId = $confirmBtn.data('edit-id');
  if (editId) {
    var editSeat = $('#summarySeat').text().trim();
    if (editSeat && editSeat !== '-') {
      var $editSeat = $('.seat[data-seat="' + editSeat + '"]');
      if ($editSeat.length && !$editSeat.hasClass('occupied')) {
        $editSeat.removeClass('available reserved').addClass('selected');
      }
    }
    updateSummary();
  }

  // --- Confirm / Update reservation ---
  $confirmBtn.on('click', function() {
    if (!window.isLoggedIn) {
      alert('Please log in first to make a reservation.');
      window.location.href = '/login';
      return;
    }
    var labCode = $(this).data('lab');
    var seat = $('.seat.selected').attr('data-seat');
    if (!seat) { alert('Please select a seat.'); return; }

    var date = $('#reserveDate').val();
    var timeSlots = getSelectedSlots();
    var anonymous = $('#anonymousToggle').is(':checked');

    if (!date) { alert('Please select a date.'); return; }
    var today = new Date().toISOString().split('T')[0];
    if (date < today) { alert('Please select today or a future date.'); return; }
    if (timeSlots.length === 0) { alert('Please select at least one time slot.'); return; }

    // Edit mode: update single reservation
    if (editId) {
      fetch('/api/reservations/' + editId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lab: labCode, seat: seat, date: date,
          timeSlots: timeSlots, anonymous: anonymous
        })
      })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.success) {
          alert('Reservation updated for Seat ' + seat + ' at ' + labCode + '!');
          window.location.href = '/reservations';
        } else {
          alert(data.error || 'Failed to update reservation.');
        }
      })
      .catch(function() { alert('Failed to update reservation.'); });
      return;
    }

    // New reservation: send array of time slots
    fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lab: labCode,
        seat: seat,
        date: date,
        timeSlots: timeSlots,
        anonymous: anonymous
      })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.success) {
        var count = data.count || timeSlots.length;
        alert('Reserved ' + count + ' slot' + (count > 1 ? 's' : '') + ' for Seat ' + seat + ' at ' + labCode + '!');
        window.location.href = '/reservations';
      } else {
        alert(data.error || 'Failed to save reservation.');
      }
    })
    .catch(function() {
      alert('Failed to save reservation. Please try again.');
    });
  });

  // --- Refresh seat availability across all selected time slots ---
  function refreshAvailability() {
    var labCode = $('#confirmBtn').data('lab');
    var date = $('#reserveDate').val();
    var slots = getSelectedSlots();
    if (!labCode || !date) return;

    // If no slots selected, just show all as available (based on initial state)
    if (slots.length === 0) {
      $('.seat').each(function() {
        if (!$(this).hasClass('selected')) {
          $(this).removeClass('occupied reserved').addClass('available');
          $(this).attr('title', $(this).attr('data-seat') + ' - Available');
        }
      });
      var totalSeats = $('.seat').length;
      $('.availability-badge').text(totalSeats + ' seats available');
      return;
    }

    // Clear selection when filters change
    $('.seat.selected').removeClass('selected').addClass('available');
    $('#summarySeat').text('-');
    updateSummary();

    // Fetch availability for each selected slot, merge results
    var fetches = slots.map(function(slot) {
      return fetch('/api/labs/' + encodeURIComponent(labCode) + '/seats?date=' + date + '&timeSlot=' + encodeURIComponent(slot))
        .then(function(res) { return res.json(); });
    });

    Promise.all(fetches).then(function(results) {
      // A seat is only available if it's available in ALL selected slots
      var seatStatus = {};
      var seatTooltip = {};
      results.forEach(function(resp) {
        var seats = (resp && resp.data && resp.data.seats) || (resp && resp.seats) || [];
        seats.forEach(function(seat) {
          if (!seatStatus[seat.id]) {
            seatStatus[seat.id] = 'available';
            seatTooltip[seat.id] = seat.id + ' - Available';
          }
          if (seat.status !== 'available') {
            seatStatus[seat.id] = seat.status;
            if (seat.occupant) {
              seatTooltip[seat.id] = seat.id + ' - Reserved by ' + seat.occupant;
            } else {
              seatTooltip[seat.id] = seat.id + ' - Reserved';
            }
          }
        });
      });

      var availableCount = 0;
      $('.seat').each(function() {
        var id = $(this).attr('data-seat');
        var status = seatStatus[id] || 'available';
        $(this).removeClass('available occupied reserved selected').addClass(status);
        $(this).attr('title', seatTooltip[id] || id);
        if (status === 'available') availableCount++;
      });
      $('.availability-badge').text(availableCount + ' seats available');
    }).catch(function() { /* silently fail */ });
  }
  setInterval(refreshAvailability, 30000);

  // Initial timeslot availability check and summary update
  updateTimeslotAvailability();
  updateSummary();
}


// =============================================================================
// RESERVATIONS PAGE — FILTERS, CANCEL, EDIT, REBOOK
// =============================================================================

function initReservationsPage() {
  var $list = $('.reservations-list');
  if (!$list.length) return;

  // Filter tabs
  $('.tab-btn').on('click', function() {
    var filter = $(this).data('filter');
    $('.tab-btn').removeClass('active');
    $(this).addClass('active');

    $('.reservation-card').each(function() {
      var status = $(this).data('status');
      if (filter === 'all' || status === filter) {
        $(this).removeClass('filter-hidden');
      } else {
        $(this).addClass('filter-hidden');
      }
    });

    if (typeof window.refreshPagination === 'function') {
      window.refreshPagination();
    }
  });

  // Cancel reservation
  $list.on('click', '.action-btn.cancel', function() {
    var card = $(this).closest('.reservation-card');
    if (!confirm('Are you sure you want to cancel this reservation?')) return;

    var resId = card.data('id');
    fetch('/api/reservations/' + resId + '/cancel', { method: 'PUT' })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.success) {
        card.attr('data-status', 'cancelled').data('status', 'cancelled');
        card.removeClass('upcoming').addClass('cancelled');
        card.find('.status-badge').first().text('Cancelled').removeClass('upcoming completed').addClass('cancelled');
        card.find('.action-btn.edit').remove();
        card.find('.action-btn.cancel').replaceWith('<button class="action-btn rebook">Book Again</button>');

        var activeFilter = $('.tab-btn.active').data('filter');
        if (activeFilter !== 'all' && activeFilter !== 'cancelled') {
          card.fadeOut('fast');
        }
      } else {
        alert(data.error || 'Failed to cancel reservation.');
      }
    })
    .catch(function() { alert('Failed to cancel reservation.'); });
  });

  // Rebook
  $list.on('click', '.action-btn.rebook', function() {
    var card = $(this).closest('.reservation-card');
    var lab = card.find('.reservation-main h3').text().split(' - ')[0];
    if (lab) {
      window.location.href = '/reserve?lab=' + encodeURIComponent(lab.trim());
    }
  });

  // Edit
  $list.on('click', '.action-btn.edit', function() {
    var card = $(this).closest('.reservation-card');
    var lab = card.find('.reservation-main h3').text().split(' - ')[0];
    var resId = card.data('id') || '';
    window.location.href = '/reserve?lab=' + encodeURIComponent(lab) + '&edit=' + resId;
  });
}


// =============================================================================
// LAB FILTERS (cmpslots page)
// =============================================================================

function initLabFilters() {
  var $filterBtn = $('.filter-btn');
  if (!$filterBtn.length) return;

  var buildingMap = {
    andrew: 'andrew building',
    lasalle: 'la salle hall',
    gokongwei: 'gokongwei building'
  };

  // Set default date to today
  var today = new Date().toISOString().split('T')[0];
  if (!$('#dateFilter').val()) $('#dateFilter').val(today);

  $filterBtn.on('click', function() {
    var selectedBuilding = $('#buildingFilter').val();
    var selectedDate = $('#dateFilter').val();
    var selectedTime = $('#timeFilter option:selected').text();
    var hasTimeFilter = $('#timeFilter').val() !== '';

    // For each lab card, fetch real-time availability if date/time selected
    $('.lab-card').each(function() {
      var $card = $(this);
      var labCode = $card.data('lab');
      var cardBuilding = $card.find('.building-tag').text().trim().toLowerCase();

      // Building filter
      if (selectedBuilding && cardBuilding !== buildingMap[selectedBuilding]) {
        $card.hide();
        return;
      }
      $card.show();

      // Date/time availability filter — fetch from API
      if (selectedDate && hasTimeFilter) {
        fetch('/api/labs/' + encodeURIComponent(labCode) + '/seats?date=' + selectedDate + '&timeSlot=' + encodeURIComponent(selectedTime))
        .then(function(res) { return res.json(); })
        .then(function(resp) {
          var seats = (resp && resp.data && resp.data.seats) || [];
          var available = 0;
          var occupied = 0;
          seats.forEach(function(s) {
            if (s.status === 'available') available++;
            else occupied++;
          });
          $card.find('.stat-number.available').text(available);
          $card.find('.stat-number.occupied').text(occupied);
        })
        .catch(function() {});
      } else if (selectedDate) {
        // Date only — count all reservations for that date
        fetch('/api/labs/' + encodeURIComponent(labCode) + '/seats?date=' + selectedDate)
        .then(function(res) { return res.json(); })
        .then(function(resp) {
          var seats = (resp && resp.data && resp.data.seats) || [];
          var available = 0;
          var occupied = 0;
          seats.forEach(function(s) {
            if (s.status === 'available') available++;
            else occupied++;
          });
          $card.find('.stat-number.available').text(available);
          $card.find('.stat-number.occupied').text(occupied);
        })
        .catch(function() {});
      }
    });
  });
}


// =============================================================================
// PROFILE PAGE — EDIT, DELETE, CHANGE PASSWORD, AVATAR
// =============================================================================

function initProfilePage() {
  var $editBtn = $('#editPersonalBtn');
  if (!$editBtn.length) return;

  var $form = $('#personalForm');
  var $inputs = $form.find('input, select, textarea');
  var $actions = $('#personalActions');
  var originalValues = {};

  // Edit mode
  $editBtn.on('click', function() {
    $inputs.prop('disabled', false);
    $actions.removeClass('hidden');
    $editBtn.hide();
    originalValues = {
      firstName: $('#firstName').val(),
      lastName: $('#lastName').val(),
      college: $('#college').val(),
      bio: $('#bio').val()
    };
  });

  // Cancel edit
  $actions.find('.cancel-btn').on('click', function() {
    $('#firstName').val(originalValues.firstName);
    $('#lastName').val(originalValues.lastName);
    $('#college').val(originalValues.college);
    $('#bio').val(originalValues.bio);
    $inputs.prop('disabled', true);
    $actions.addClass('hidden');
    $editBtn.show();
  });

  // Save profile
  $actions.find('.save-btn').on('click', function(e) {
    e.preventDefault();
    var firstName = $('#firstName').val().trim();
    var lastName = $('#lastName').val().trim();
    if (!firstName || !lastName) {
      alert('Please fill out all required fields.');
      return;
    }

    fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        college: $('#college').val(),
        bio: $('#bio').val().trim()
      })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.success) {
        $('.header-info h1').text(firstName + ' ' + lastName);
        var initials = (firstName[0] || '') + (lastName[0] || '');
        $('.avatar span').text(initials);
        $inputs.prop('disabled', true);
        $actions.addClass('hidden');
        $editBtn.show();
        alert('Profile updated!');
      } else {
        alert(data.error || 'Failed to update profile.');
      }
    })
    .catch(function() { alert('Failed to update profile.'); });
  });

  // Delete account
  $('.danger-btn').on('click', function() {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;

    fetch('/api/profile', { method: 'DELETE' })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.success) {
        window.location.href = '/';
      } else {
        alert(data.error || 'Failed to delete account.');
      }
    })
    .catch(function() { alert('Failed to delete account.'); });
  });

  // Change password redirect
  $('.setting-btn').on('click', function() {
    window.location.href = '/changepassword';
  });

  // Notifications toggle
  $('#notificationsToggle').on('change', function() {
    var enabled = $(this).is(':checked');
    fetch('/api/profile/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notifications: enabled })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (!data.success) {
        alert(data.error || 'Failed to update notification settings.');
      }
    })
    .catch(function() { alert('Failed to update notification settings.'); });
  });

  // Avatar upload
  var $fileInput = $('<input>', { type: 'file', accept: 'image/png, image/jpeg, image/gif', style: 'display:none' }).appendTo('body');
  $('.change-avatar-btn').on('click', function() { $fileInput.click(); });
  $fileInput.on('change', function() {
    var file = this.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('File too large! Max 2MB.'); return; }
    var reader = new FileReader();
    reader.onload = function(e) {
      var dataUrl = e.target.result;
      fetch('/api/profile/avatar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: dataUrl })
      })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.success) {
          var $img = $('<img>').attr({ src: dataUrl, style: 'width:100%;height:100%;border-radius:50%;object-fit:cover;' });
          $('.avatar').empty().append($img);
        } else {
          alert(data.error || 'Failed to upload avatar.');
        }
      })
      .catch(function() { alert('Failed to upload avatar.'); });
    };
    reader.readAsDataURL(file);
  });
}


// =============================================================================
// CHANGE PASSWORD PAGE
// =============================================================================

function initChangePasswordPage() {
  var $form = $('#changePasswordForm');
  if (!$form.length) return;

  $form.on('submit', function(e) {
    e.preventDefault();
    var currentPassword = $('#currentPassword').val();
    var newPassword = $('#newPassword').val();
    var confirmPassword = $('#confirmPassword').val();
    var $error = $('#passwordError');
    var $success = $('#passwordSuccess');
    $error.hide().text('');
    $success.hide().text('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      $error.text('All fields are required.').show(); return;
    }
    if (newPassword.length < 8) {
      $error.text('New password must be at least 8 characters long.').show(); return;
    }
    if (newPassword !== confirmPassword) {
      $error.text('New password and confirmation do not match.').show(); return;
    }

    fetch('/api/profile/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: currentPassword,
        newPassword: newPassword
      })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.success) {
        alert('Password changed successfully!');
        window.location.href = '/profile';
      } else {
        $error.text(data.error || 'Failed to change password.').show();
      }
    })
    .catch(function() {
      $error.text('Failed to change password.').show();
    });
  });
}


// =============================================================================
// USERS PAGE — SEARCH & FILTER
// =============================================================================

function initUserSearch() {
  var $searchInput = $('#userSearch');
  if (!$searchInput.length) return;

  var $collegeFilter = $('#collegeFilter');
  var $searchBtn = $('.search-btn');

  function filterCards() {
    var searchTerm = $searchInput.val().toLowerCase().trim();
    var selectedCollege = $collegeFilter.val();

    $('.user-card').each(function() {
      var $card = $(this);
      var name = $card.find('h3').text().toLowerCase();
      var studentId = $card.find('.user-id').text().toLowerCase();
      var college = $card.find('.college-badge').text();
      var matchesSearch = name.indexOf(searchTerm) > -1 || studentId.indexOf(searchTerm) > -1;
      var matchesCollege = selectedCollege === '' || college === selectedCollege;
      if (matchesSearch && matchesCollege) {
        $card.removeClass('filter-hidden');
      } else {
        $card.addClass('filter-hidden');
      }
    });

    if (typeof window.refreshPagination === 'function') {
      window.refreshPagination();
    }
  }

  $searchBtn.on('click', filterCards);
  $searchInput.on('keyup', filterCards);
  $collegeFilter.on('change', filterCards);
  $searchInput.on('keypress', function(e) { if (e.which === 13) filterCards(); });
  filterCards();
}


// =============================================================================
// WALK-IN PAGE — CREATE & REMOVE
// =============================================================================

function initWalkInPage() {
  var $confirmBtn = $('#walkinConfirmBtn');
  if (!$confirmBtn.length) return;

  // --- Helper: get all selected time slot labels ---
  function getSelectedSlots() {
    var slots = [];
    $('#timeslotGrid input:checked').each(function() {
      slots.push($(this).val());
    });
    return slots;
  }

  // --- Helper: update the booking summary ---
  function updateSummary() {
    var slots = getSelectedSlots();
    var seat = $('.seat.selected').attr('data-seat');
    var count = slots.length;

    $('#slotCountLabel').text('(' + count + ' selected)');

    if (count === 0) {
      $('#summaryTime').text('-');
      $('#summaryDuration').text('-');
    } else if (count === 1) {
      $('#summaryTime').text(slots[0]);
      $('#summaryDuration').text('30 min');
    } else {
      $('#summaryTime').text(slots[0].split(' - ')[0] + ' - ' + slots[count - 1].split(' - ')[1]);
      $('#summaryDuration').text((count * 30) + ' min (' + count + ' slots)');
    }

    var canConfirm = seat && count > 0;
    $confirmBtn.prop('disabled', !canConfirm)
      .text(canConfirm
        ? 'Confirm ' + count + ' Slot' + (count > 1 ? 's' : '')
        : (seat ? 'Select Time Slots' : 'Select a Seat to Continue'));
  }

  // --- Time slot chip click (auto-fill consecutive slots) ---
  $('#timeslotGrid').on('change', 'input[type="checkbox"]', function() {
    var $allChips = $('#timeslotGrid .timeslot-chip').not('.disabled');
    var clickedIndex = $allChips.index($(this).closest('.timeslot-chip'));

    if (this.checked) {
      var checkedIndices = [];
      $allChips.each(function(i) {
        if ($(this).find('input').is(':checked')) checkedIndices.push(i);
      });

      if (checkedIndices.length > 1) {
        var minIdx = Math.min.apply(null, checkedIndices);
        var maxIdx = Math.max.apply(null, checkedIndices);
        $allChips.each(function(i) {
          if (i >= minIdx && i <= maxIdx) {
            $(this).addClass('active');
            $(this).find('input').prop('checked', true);
          }
        });
      } else {
        $(this).closest('.timeslot-chip').addClass('active');
      }
    } else {
      var uncheckFrom = clickedIndex;
      $allChips.each(function(i) {
        if (i >= uncheckFrom) {
          $(this).removeClass('active');
          $(this).find('input').prop('checked', false);
        }
      });
    }
    updateSummary();
    refreshAvailability();
  });

  // --- Seat click handler ---
  $('.seat-grid').on('click', '.seat.available', function() {
    $('.seat.selected').removeClass('selected').addClass('available');
    $(this).removeClass('available').addClass('selected');
    var seatId = $(this).attr('data-seat');
    $('#summarySeat').text(seatId);
    updateSummary();
  });

  // --- Date change ---
  $('#reserveDate').on('change', function() {
    var val = $(this).val();
    if (val) $('#summaryDate').text(formatDateLong(val));
    updateTimeslotAvailability();
    refreshAvailability();
  });

  // --- Timeslot availability for today ---
  function updateTimeslotAvailability() {
    var selectedDate = $('#reserveDate').val();
    var today = new Date().toISOString().split('T')[0];

    if (selectedDate === today) {
      var now = new Date();
      var currentMinutes = now.getHours() * 60 + now.getMinutes();

      $('#timeslotGrid .timeslot-chip').each(function() {
        var slotValue = $(this).attr('data-slot-value');
        if (!slotValue) return;
        var endPart = slotValue.split(' - ')[1];
        var parts = endPart.split(':');
        var endMinutes = parseInt(parts[0]) * 60 + parseInt(parts[1]);

        if (currentMinutes >= endMinutes) {
          $(this).addClass('disabled');
          $(this).find('input').prop('disabled', true).prop('checked', false);
          $(this).removeClass('active');
        } else {
          $(this).removeClass('disabled');
          $(this).find('input').prop('disabled', false);
        }
      });
    } else {
      $('#timeslotGrid .timeslot-chip').each(function() {
        $(this).removeClass('disabled');
        $(this).find('input').prop('disabled', false);
      });
    }
    updateSummary();
  }

  // --- Confirm walk-in reservation ---
  $confirmBtn.on('click', function() {
    var labCode = $(this).data('lab');
    var seat = $('.seat.selected').attr('data-seat');
    if (!seat) { alert('Please select a seat.'); return; }

    var date = $('#reserveDate').val();
    var timeSlots = getSelectedSlots();

    if (!date) { alert('Please select a date.'); return; }
    if (timeSlots.length === 0) { alert('Please select at least one time slot.'); return; }

    fetch('/api/walkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lab: labCode,
        seat: seat,
        date: date,
        timeSlots: timeSlots
      })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.success) {
        var count = data.count || timeSlots.length;
        alert('Walk-in reservation created!\n\n' + count + ' slot' + (count > 1 ? 's' : '') + ' for Seat ' + seat + ' at ' + labCode);
        window.location.href = '/reservations';
      } else {
        alert(data.error || 'Failed to create walk-in reservation.');
      }
    })
    .catch(function() {
      alert('Failed to create walk-in reservation.');
    });
  });

  // --- Refresh seat availability ---
  function refreshAvailability() {
    var labCode = $confirmBtn.data('lab');
    var date = $('#reserveDate').val();
    var slots = getSelectedSlots();
    if (!labCode || !date) return;

    if (slots.length === 0) {
      $('.seat').each(function() {
        if (!$(this).hasClass('selected')) {
          $(this).removeClass('occupied reserved').addClass('available');
          $(this).attr('title', $(this).attr('data-seat') + ' - Available');
        }
      });
      var totalSeats = $('.seat').length;
      $('.availability-badge').text(totalSeats + ' seats available');
      return;
    }

    $('.seat.selected').removeClass('selected').addClass('available');
    $('#summarySeat').text('-');
    updateSummary();

    var fetches = slots.map(function(slot) {
      return fetch('/api/labs/' + encodeURIComponent(labCode) + '/seats?date=' + date + '&timeSlot=' + encodeURIComponent(slot))
        .then(function(res) { return res.json(); });
    });

    Promise.all(fetches).then(function(results) {
      var seatStatus = {};
      var seatTooltip = {};
      results.forEach(function(resp) {
        var seats = (resp && resp.data && resp.data.seats) || (resp && resp.seats) || [];
        seats.forEach(function(seat) {
          if (!seatStatus[seat.id]) {
            seatStatus[seat.id] = 'available';
            seatTooltip[seat.id] = seat.id + ' - Available';
          }
          if (seat.status !== 'available') {
            seatStatus[seat.id] = seat.status;
            seatTooltip[seat.id] = seat.occupant ? seat.id + ' - Reserved by ' + seat.occupant : seat.id + ' - Reserved';
          }
        });
      });

      var availableCount = 0;
      $('.seat').each(function() {
        var id = $(this).attr('data-seat');
        var status = seatStatus[id] || 'available';
        $(this).removeClass('available occupied reserved selected').addClass(status);
        $(this).attr('title', seatTooltip[id] || id);
        if (status === 'available') availableCount++;
      });
      $('.availability-badge').text(availableCount + ' seats available');
    }).catch(function() {});
  }
  setInterval(refreshAvailability, 30000);

  // Initial setup
  updateTimeslotAvailability();
  updateSummary();
}


// =============================================================================
// PAGINATION (shared across pages)
// =============================================================================

function initPagination() {
  if ($('.pagination').length === 0) return;

  var itemsPerPage = 5;
  var currentPage = 1;

  // Get all paginatable items and mark them as included initially
  var $allItems = $('.reservation-card, .user-card');
  $allItems.addClass('paginate-item');

  function getFilteredItems() {
    // Items NOT hidden by search/filter (i.e. not display:none from filterCards)
    // We use a class to distinguish filter-hidden from pagination-hidden
    return $allItems.not('.filter-hidden');
  }

  function showPage(page) {
    var $filtered = getFilteredItems();
    var totalPages = Math.ceil($filtered.length / itemsPerPage) || 1;

    // Clamp page
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    currentPage = page;

    // Hide all, then show only the current page slice
    $allItems.hide();
    var start = (page - 1) * itemsPerPage;
    $filtered.slice(start, start + itemsPerPage).show();

    // Update page number buttons
    var $pageNumbers = $('.page-numbers');
    $pageNumbers.empty();
    for (var i = 1; i <= totalPages; i++) {
      var activeClass = (i === page) ? ' active' : '';
      $pageNumbers.append('<button class="page-num' + activeClass + '">' + i + '</button>');
    }

    // Update prev/next
    $('.page-btn').first().prop('disabled', page <= 1);
    $('.page-btn').last().prop('disabled', page >= totalPages);
    $('.page-info').text('Page ' + page + ' of ' + totalPages);
  }

  $('.page-btn').first().on('click', function() { showPage(currentPage - 1); });
  $('.page-btn').last().on('click', function() { showPage(currentPage + 1); });
  $('.pagination').on('click', '.page-num', function() {
    showPage(parseInt($(this).text()));
  });

  showPage(1);
  window.refreshPagination = function() { showPage(1); };
}


// =============================================================================
// GLOBAL SEARCH (shared across all pages)
// =============================================================================

function initGlobalSearch() {
  var $searchInput = $('.search-bar input');
  var path = window.location.pathname;

  function performSearch() {
    var searchTerm = $searchInput.val().trim().toLowerCase();

    if (path.indexOf('/cmpslots') > -1) {
      // Filter lab cards by lab code or building name
      $('.lab-card').each(function() {
        if (!searchTerm) { $(this).show(); return; }
        var labName = $(this).find('h3').text().toLowerCase();
        var building = $(this).find('.building-tag').text().toLowerCase();
        $(this).toggle(labName.indexOf(searchTerm) > -1 || building.indexOf(searchTerm) > -1);
      });
    } else if (path.indexOf('/users') > -1) {
      // Delegate to the dedicated user search input
      $('#userSearch').val(searchTerm).trigger('keyup');
    } else if (path.indexOf('/reservations') > -1) {
      // Filter reservation cards by lab, seat, or building
      $('.reservation-card').each(function() {
        if (!searchTerm) { $(this).removeClass('filter-hidden'); return; }
        var labSeat = $(this).find('.reservation-main h3').text().toLowerCase();
        var building = $(this).find('.location').text().toLowerCase();
        var time = $(this).find('.time').text().toLowerCase();
        if (labSeat.indexOf(searchTerm) > -1 || building.indexOf(searchTerm) > -1 || time.indexOf(searchTerm) > -1) {
          $(this).removeClass('filter-hidden');
        } else {
          $(this).addClass('filter-hidden');
        }
      });
      if (typeof window.refreshPagination === 'function') {
        window.refreshPagination();
      }
    } else if (path.indexOf('/reserve') > -1) {
      // Highlight matching seats in the seat grid
      if (!searchTerm) {
        $('.seat').removeClass('search-highlight');
        return;
      }
      $('.seat').each(function() {
        var seatId = $(this).attr('data-seat').toLowerCase();
        if (seatId.indexOf(searchTerm) > -1) {
          $(this).addClass('search-highlight');
        } else {
          $(this).removeClass('search-highlight');
        }
      });
    } else {
      // All other pages: redirect to cmpslots with search query
      if (searchTerm) {
        window.location.href = '/cmpslots?search=' + encodeURIComponent(searchTerm);
      }
    }
  }

  // Search on Enter key
  $searchInput.on('keypress', function(e) {
    if (e.which !== 13) return;
    performSearch();
  });

  // Live search as user types (for pages with client-side filtering)
  $searchInput.on('input', function() {
    if (path.indexOf('/cmpslots') > -1 ||
        path.indexOf('/users') > -1 ||
        path.indexOf('/reservations') > -1 ||
        path.indexOf('/reserve') > -1) {
      performSearch();
    }
  });

  // Apply search from URL query param on cmpslots
  var urlSearch = new URLSearchParams(window.location.search).get('search');
  if (urlSearch && path.indexOf('/cmpslots') > -1) {
    $searchInput.val(urlSearch);
    performSearch();
  }
}


// =============================================================================
// INIT — Detect page and bind handlers
// =============================================================================

$(document).ready(function() {
  var path = window.location.pathname;

  // Background slideshow on auth pages (index, login, register)
  initBgSlideshow();

  // Signout is available on all authenticated pages
  if ($('#signoutBtn').length) {
    initSignout();
  }

  // Page-specific handlers
  if (path === '/login' || path === '/login/') {
    initLoginPage();
  } else if (path === '/adminsignup' || path === '/adminsignup/') {
    initTechLoginPage();
  } else if (path === '/register' || path === '/register/') {
    initRegisterPage();
  } else if (path === '/reservations' || path === '/reservations/') {
    initReservationsPage();
  } else if (path === '/walkin' || path === '/walkin/') {
    initWalkInPage();
  } else if (path.indexOf('/reserve') > -1) {
    initSeatSelection();
  } else if (path === '/profile' || path === '/profile/') {
    initProfilePage();
  } else if (path === '/users' || path === '/users/') {
    initUserSearch();
  } else if (path === '/changepassword' || path === '/changepassword/') {
    initChangePasswordPage();
  }

  // Auth-gate: intercept clicks on links that require login
  $(document).on('click', '[data-requires-auth]', function(e) {
    e.preventDefault();
    alert('Please log in first to access this page.');
    window.location.href = '/login';
  });

  // Global handlers
  initGlobalSearch();
  if ($('.pagination').length > 0) {
    initPagination();
  }
});
