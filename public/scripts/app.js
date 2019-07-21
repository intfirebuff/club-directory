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

    // fetch changelog
    const fetchChangelog = (id, cb) => {
        $.getJSON({
            url: `/api/club/${id}/history`,
            success: (response) => {
                cb(response);
            },
            fail: handleError('fetchChangelog')
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

    const renderChangeLog = (data) => {
        if (!data.length) {
            return
        };

        let changes = [];
        changes = data.map((change, i) => {
            return `
            <table class="table" style="margin-bottom: 0;">
            <tr>
                <td width="60%">${change.description}</td>
                <td width="25%">${change.updated_by}</td>
                <td width="15%">${change.created_at}</td>
            </tr>
            </table>`;
        });
        $(".modal-changelog").prepend(`<h6>Change History</h6>` + changes.join(''))
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

    generateMapString = (address) => {
        if (address.slice(0, 5) === 'P. O.' || address.startsWith('null')) {
            return '';
        }

        return `
            <iframe
                width="450"
                height="250"
                frameborder="0" style="border:0"
                src="https://www.google.com/maps/embed/v1/search?q=${address}" allowfullscreen>
            </iframe>`;
    }

    $('#modal').on('show.bs.modal', function (event) {
        let i = $(event.relatedTarget).data('index');
        let club = dataObj[i];
        let { id, name, address_1, address_2, city, state_code, zip, country, website, email, facebook_url, twitter_handle, instagram_handle } = club;
        let mapString = `${address_2}, ${city}, ${state_code} ${zip} ${country}`;
        $('.modal-title').text(name);
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
            <div class="mapbox">
                ${generateMapString(mapString)}
            </div>
            <div class="modal-officers">
                <!-- officer list is injected here -->
            </div>
            <div class="modal-changelog">
                <!-- changelog is injected here -->
            </div>
            `
        );
        fetchOfficers(id, renderOfficers);
        fetchChangelog(id, renderChangeLog);
    })
});