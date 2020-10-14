$(document).ready(function () {

    let allClubs = null;
    let dataObj = null;
    let ifbaOfficers = null;

    let now = new Date();
    let year = now.getFullYear();
    $("#currentyear").text(year);
    const allClubsOption = "A";

    $("#regionSelect").on("change", function() {
        let opt = $(this).find('option:selected')[0]; 
        if (!opt.value) {
            // return early if placeholder text
            return;
        }

        showRegionalVP(opt.value);

        if (opt.value == allClubsOption) {
            return renderClubs(allClubs);
        } else {
            return renderClubs(allClubs.filter(club => club.region == opt.value));
        }
    });

    // fetch clubs from /api/club/all
    const fetchAllClubs = () => {
        $.getJSON({
            url: '/api/club/all',
            success: (response) => {
                allClubs = response;
            },
            error: handleError('fetchAllClubs')
        })
    }

    // fetch ifba officers from /api/officers/ifba
    const fetchIfbaOfficers = () => {
        $.getJSON({
            url: '/api/ifba/officers',
            success: (response) => {
                ifbaOfficers = response;
            },
            error: handleError('fetchClubOfficers')
        })
    }

    showRegionalVP = (region) => {
        if (region === allClubsOption) {
            $("#regionVP").html('');
            return;
        }

        let officer = ifbaOfficers.find(officer => officer.role.includes(region));
        
        if (officer === undefined) {
            $("#regionVP").html(`<p>No Regional VP on file</p>`);
        } else {
            $("#regionVP").html(`<p>VP ${officer.name}</p>`);
        }
        return;
    }

    // fetch club officers from /api/officers/:id
    const fetchClubOfficers = (id, cb) => {
        $.getJSON({
            url: `/api/officers/${id}`,
            success: (response) => {
                cb(response);
            },
            error: handleError('fetchClubOfficers')
        })
    }

    const renderClubs = (data) => {
        dataObj = data;
        const clubs = data.map((club, i) => {
            return generateClubCardHtml(club, i);
        })
        $("#clubList").html('');
        $("#clubList").prepend(clubs.join(''));
    }

    const renderOfficers = (data) => {
        let officers = [];
        if ($(window).width() < 992) {
            officers = data.map((officer, i) => {
                return generateMobileOfficerHtml(officer, i);
            })
        } else {
            officers = data.map((officer, i) => {
                return generateOfficerHtml(officer, i);
            })
        }
        $(".modal-officers").prepend(officers.join(''));
    }

    const handleError = (method) => {
      return (err) => {
        console.debug(method, err);
      }
    }

    const generateClubCardHtml = (club, i) => {
        let { name, address_1, address_2, city, state_code, zip, country, website, email, facebook_url, twitter_handle, instagram_handle } = club;
        return `
          <div class="card club shadow">
            <h5 class="card-header">${name}</h5>
            <div class="card-body">
                <!-- <img class="card-img-top" src="https://via.placeholder.com/286x180"> -->
                <p>
                    ${address_1 ? `${address_1}<br>` : ''}
                    ${address_2 ? `${address_2}<br>` : ''}
                    ${city}, ${state_code} ${zip}<br>
                    ${country}
                </p>
                <p class="contact">
                    ${email ? `<a href="mailto:${email}">${email}</a>` : ''}
                    ${email && website ? `<br>` : ''}
                    ${website ? `<a href="${website}" target="_blank">${website}</a>` : ''}
                </p>
                <div class="social">
                    ${facebook_url ? `<a href="${facebook_url}" target="_blank"><i class="fab fa-facebook-square"></i></a>` : ''}
                    ${twitter_handle ? `<a href="https://twitter.com/${twitter_handle}" target="_blank"><i class="fab fa-twitter-square"></i></a>` : ''}
                    ${instagram_handle ? `<a href="https://instagram.com/${instagram_handle}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
                </div>
                <button type="button" class="btn btn-secondary" data-toggle="modal" data-index="${i}" data-target="#modal">More Info</button>
            </div>
          </div>`;
    }

    const generateOfficerHtml = (officer) => {
        return `
            <table class="table" style="margin-bottom: 0;">
            <tr>
                <td width="15%">${officer.role}</td>
                <td width="35%">
                    <p>
                    ${officer.name}
                    ${officer.address_1 ? `<br>${officer.address_1}` : ''}
                    ${officer.address_2 ? `
                            <br>${officer.address_2}
                            <br>${officer.city}, ${officer.state_code}
                            <br>${officer.zip}`
                        : ''}
                    </p>
                </td>
                <td width="35%">
                    ${officer.email_1 ? `<a href="mailto:${officer.email_1}">${officer.email_1}</a><br>` : ''}
                    ${officer.email_2 ? `<a href="mailto:${officer.email_2}">${officer.email_2}</a><br>` : ''}
                    ${officer.email_3 ? `<a href="mailto:${officer.email_3}">${officer.email_3}</a><br>` : ''}
                    ${officer.phone_1 ? `${officer.phone_1}` : ''}
                    ${officer.phone_2 ? `<br>${officer.phone_2}` : ''}
                </td>
                <td width="5%">${officer.facebook_url ? `<a href="${officer.facebook_url}" target="_blank"><i class="fab fa-facebook-square"></i></a>` : ''}</td>
            </tr>
            </table>`;
    }

    const generateMobileOfficerHtml = (officer) => {
        return `
            <hr>
            <div style="margin-left: 10px;">
                <p>${officer.name}, ${officer.role}<br>
                    ${officer.address_1 ? `${officer.address_1}<br>` : ''}
                    ${officer.address_2
                        ? `
                                ${officer.address_2}<br>
                                ${officer.city}, ${officer.state_code}<br>
                                ${officer.zip}<br>
                            `
                        : ''
                    }
                    ${officer.email_1 ? `<a href="mailto:${officer.email_1}">${officer.email_1}</a><br>` : ''}
                    ${officer.email_2 ? `<a href="mailto:${officer.email_2}">${officer.email_2}</a><br>` : ''}
                    ${officer.email_3 ? `<a href="mailto:${officer.email_3}">${officer.email_3}</a><br>` : ''}
                    ${officer.phone_1 ? `${officer.phone_1}<br>` : ''}
                    ${officer.phone_2 ? `${officer.phone_2}` : ''}
                </p>
            </div>`;
    }

    $('#modal').on('show.bs.modal', function (event) {
        let i = $(event.relatedTarget).data('index');
        let club = dataObj[i];
        let { id, name, address_1, address_2, city, state_code, zip, country, website, email, facebook_url, twitter_handle, instagram_handle } = club;
        $('.modal-title').text(name);
        $('.modal-edit-button').html(`<i class="fas fa-edit" data-index="${i}" aria-label="Edit Club" role="button"></i>`)
        $('.modal-body').html(`
            <div style="margin-left: 10px;">
                <p>
                    ${address_1 ? `${address_1}<br>` : ''}
                    ${address_2 ? `${address_2}<br>` : ''}
                    ${city}, ${state_code} ${zip}<br>
                    ${country}
                </p>
                <p class="contact">
                    ${email ? `<a href="mailto:${email}">${email}</a>` : ''}
                    ${email && website ? `<br>` : ''}
                    ${website ? `<a href="${website}" target="_blank">${website}</a>` : ''}
                </p>
                <div class="social">
                    ${facebook_url ? `<a href="${facebook_url}" target="_blank"><i class="fab fa-facebook-square"></i></a>` : ''}
                    ${twitter_handle ? `<a href="https://twitter.com/${twitter_handle}" target="_blank"><i class="fab fa-twitter-square"></i></a>` : ''}
                    ${instagram_handle ? `<a href="https://instagram.com/${instagram_handle}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
                </div>
            </div>
            <div class="modal-officers">
                <!-- officer list is injected here -->
            </div>
            `
        );
        fetchClubOfficers(id, renderOfficers);
    })

    $('.modal-edit-button').on('click', function (event) {
        let i = event.target.dataset.index
        let club = dataObj[i];
        let { name, address_1, address_2, city, state_code, zip, country, website, email, facebook_url, twitter_handle, instagram_handle } = club;
        $('.modal-title').text(`Editing: ${name}`);
        $('.modal-edit-button').html('');
        $('.modal-body').html(`
            <div class="modal-edit-form">
                <h5>Missing or incorrect info? Send us an update!</h5>
                <form id="editForm">
                    Your Name (in case we have questions - REQUIRED)<br>
                    <input type="text" name="submitter_name" required data-lpignore="true"></input>
                    <br>
                    <input type="hidden" name="club_name" value="${name}"></input>
                    <br>
                    <p>
                        Mailing Address (For Dues Notices)<br>
                        <textarea rows="4" cols="30" name="address" placeholder="${address_1 ? `${address_1}\r\n` : ''}${address_2 ? `${address_2}\r\n` : ''}${city}, ${state_code} ${zip}\r\n${country}"></textarea>
                    </p>
                    Primary Email (For Dues Notices)<br><input type="text" name="email" placeholder="${email ? email : ''}" data-lpignore="true"></input><br><br>
                    Website<br> <input type="text" id="website" class="full-width" name="website" placeholder="${website ? website : ''}" data-lpignore="true"></input><br><br>
                    Facebook URL<br> <input type="text" class="full-width" name="facebook_url" placeholder="${facebook_url ? facebook_url : ''}" data-lpignore="true"></input><br><br>
                    Twitter Account<br> <input type="text" name="twitter_handle" placeholder="${twitter_handle ? twitter_handle : ''}" data-lpignore="true"></input><br><br>
                    Instagram Account<br> <input type="text" name="instagram_handle" placeholder="${instagram_handle ? instagram_handle : ''}" data-lpignore="true"></input>
                    <br>
                    <br>
                    <button type="submit" class="btn btn-primary" value="submit">Submit Changes</button>
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>
                </form>
            </div>
        `);
        $('.modal-footer').hide()
    });

    $('body').delegate('#editForm', 'submit', (event) => {
        event.preventDefault();
        $.post({
            url: '/api/club/edit',
            data: $('#editForm').serialize(),
            success: () => {
                $('.modal-body').html(`
                    <div>
                        <p>Your submission was successfully received!</p>
                        <p>Thanks for your contribution</p>
                    </div>
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Got it!</button>
                `);
            },
            error: () => {
                $('.modal-body').html(`
                    <div>
                        <p>An error occurred and your changes weren't sent 😢</p>
                        <p>Please try again or email <a href="mailto:it@ifba.org">it@ifba.org</a></p>
                    </div>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Got it!</button>
                `);
            }
          })
        return false;
    });

    $("#logout").on("click", () => {
        $.post({
          url: '/users/logout',
          success: () => {
            location.href = "/"
          },
          error: handleError('logout')
        })
      });

    $('#modal').on('hide.bs.modal', () => {
        $('.modal-footer').show();
    });

    fetchIfbaOfficers();
    fetchAllClubs();
});