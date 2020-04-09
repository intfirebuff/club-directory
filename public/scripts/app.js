$(document).ready(function () {

    let allClubsFetched = false;
    let allClubs = null;
    let dataObj = null;

    let now = new Date();
    let year = now.getFullYear();
    $("#currentyear").text(year);

    $("#regionSelect").on("change", function() {
        const allClubsOption = "A";

        let opt = $(this).find('option:selected')[0]; 
        if (!opt.value) {
            // return early if placeholder text
            return;
        }

        if (allClubsFetched) {
            // check if data has been cached
            if (opt.value == allClubsOption) {
                return renderClubs(allClubs);
            } else {
                return renderClubs(allClubs.filter(club => club.region == opt.value));
            }
        }

        return opt.value == allClubsOption ? fetchAllClubs(renderClubs) : fetchClubsByRegion(opt.value, renderClubs);
    });

    // fetch clubs from /api/club/all
    const fetchAllClubs = (cb) => {
        $.getJSON({
            url: '/api/club/all',
            success: (response) => {
                allClubs = response;
                allClubsFetched = true;
                cb(response);
            },
            fail: handleError('fetchAllClubs')
        })
    }

    // fetch clubs from /api/region/:id
    const fetchClubsByRegion = (region, cb) => {
        $.getJSON({
            url: `/api/region/${region}`,
            success: (response) => {
                cb(response);
            },
            fail: handleError('fetchClubsByRegion')
        })
    }

    // fetch club officers from /api/officers/:id
    const fetchOfficers = (id, cb) => {
        $.getJSON({
            url: `/api/officers/${id}`,
            success: (response) => {
                cb(response);
            },
            fail: handleError('fetchOfficers')
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
                <td width="15%">${officer.position}</td>
                <td width="35%">
                    <p>
                    ${officer.name}
                    ${officer.address_1 ? officer.address_1 : ''}
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
                <td width="5%"><i class="fas fa-edit officer-edit-button"></i></a></td>
            </tr>
            </table>`;
    }

    const generateMobileOfficerHtml = (officer) => {
        return `
            <hr>
            <div style="margin-left: 10px;">
                <p>${officer.name}, ${officer.position}<br>
                    ${officer.address_2
                        ? `
                                ${officer.address_2}<br>
                                ${officer.city}, ${officer.state_code}<br>
                                ${officer.zip}<br>
                            `
                        : ''
                    }
                    ${officer.email_1 ? `<a href="mailto:${officer.email_1}">${officer.email_1}</a><br>` : ''}
                    ${officer.phone_1 ? `${officer.phone_1}` : ''}
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
        fetchOfficers(id, renderOfficers);
    })

    $('.modal-edit-button').on('click', function (event) {
        let i = event.target.dataset.index
        let club = dataObj[i];
        let { id, name, address_1, address_2, city, state_code, zip, country, website, email, facebook_url, twitter_handle, instagram_handle } = club;
        $('.modal-title').text(`Editing: ${name}`);
        $('.modal-edit-button').html('');
        $('.modal-body').html(`
            <div class="modal-edit-form">
                <h5>Missing or incorrect info? Send us an update!</h5>
                <form action="api/club/edit" method="POST" >
                    Your Name (in case we have questions)<br>
                    <input type="text" name="submitter_name" data-lpignore="true"></input>
                    <br>
                    <br>
                    <p>
                        Mailing Address (For Dues Notices)<br>
                        <textarea rows="4" cols="30" name="address" placeholder="${address_1 ? `${address_1}\r\n` : ''}${address_2 ? `${address_2}\r\n` : ''}${city}, ${state_code} ${zip}\r\n${country}"></textarea>
                    </p>
                    Primary Email (For Dues Notices)<br><input type="text" name="email" placeholder="${email ? email : ''}" data-lpignore="true"></input><br><br>
                    Website<br> <input type="text" id="website" name="website" placeholder="${website ? website : ''}" data-lpignore="true"></input><br><br>
                    Facebook URL<br> <input type="text" class="facebook-input" name="facebook_url" placeholder="${facebook_url ? facebook_url : ''}" data-lpignore="true"></input><br><br>
                    Twitter Account<br> <input type="text" name="twitter_handle" placeholder="${twitter_handle ? twitter_handle : ''}" data-lpignore="true"></input><br><br>
                    Instagram Account<br> <input type="text" name="instagram_handle" placeholder="${instagram_handle ? instagram_handle : ''}" data-lpignore="true"></input>
                    <br>
                    <br>
                    <button type="submit" class="btn btn-primary" value="submit">Submit Changes</button>
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>
                    </form>
            `
        );
        $('.modal-footer').hide()
    });

    $("#logout").on("click", () => {
        $.post({
          url: '/users/logout',
          success: () => {
            location.href = "/"
          },
          fail: handleError('logout')
        })
      });

    $('#modal').on('hide.bs.modal', function (event) {
        $('.modal-footer').show();
    });
});