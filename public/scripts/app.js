$(document).ready(function () {

    let allClubsFetched = false;
    let allClubs = null;

    $("#regionSelect").on("change", function() {
        const allClubsOption = "A";
        let opt = $(this).find('option:selected')[0];

        if (!opt.value) {
            return;
        }

        if (allClubsFetched) {
            // avoid unneccesary API call; use previously fetched data
            if (opt.value == allClubsOption) {
                return renderClubs(allClubs);
            } else {
                return renderClubs(allClubs.filter(club => club.region == opt.value));
            }
        }

        if (opt.value == allClubsOption) {
            return loadAllClubs(renderClubs)
        } else {
            return loadClubsByRegion(opt.value, renderClubs);
        }
    });

    // fetches clubs from http://localhost:8080/api/club/all
    const loadAllClubs = (cb) => {
        $.getJSON({
            url: '/api/club/all',
            success: (response) => {
                allClubs = response;
                allClubsFetched = true;
                cb(response);
            },
            fail: handleError('loadAllClubs')
        })
    }

    const loadClubsByRegion = (region, cb) => {
        $.getJSON({
            url: `/api/region/${region}`,
            success: (response) => {
                cb(response);
            },
            fail: handleError('loadClubsByRegion')
        })
    }

    // renders all active clubs in DB and injects to page
    const renderClubs = (data) => {
        const clubs = data.map((club) => {
            return generateHtmlString(club);
        })
        $("#clubList").html('');
        $("#clubList").prepend(clubs.join(''));
    }

    const handleError = (method) => {
      return (err) => {
        console.debug(method, err);
      }
    }

    const generateHtmlString = (club) => {
        let { name, address_1, address_2, city, state_code, zip, country, website, email, facebook_url, twitter_handle, instagram_handle } = club;
        let mapString = `${address_2},+${city},+${state_code}+${zip}+${country}`;
        return `
          <div class="card club shadow">
            <h5 class="card-header">${name}</h5>
            <div class="card-body">
                <!-- <img class="card-img-top" src="https://via.placeholder.com/286x180"> -->
                <p>
                    ${address_1 ? `${address_1}<br>` : ''}
                    ${address_2}<br>
                    ${city}, ${state_code} ${zip}<br>
                    ${country}
                </p>
                <p class="contact">
                    ${email ? `<a href="mailto:${email}">${email}</a>` : ''}
                    ${email && website ? `<br>` : ''}
                    ${website ? `<a href="${website}">${website}</a>` : ''}
                </p>
                <div class="social">
                    ${facebook_url ? `<a href="${facebook_url}"><i class="fab fa-facebook-square"></i></a>` : ''}
                    ${twitter_handle ? `<a href="https://twitter.com/${twitter_handle}"><i class="fab fa-twitter-square"></i></a>` : ''}
                    ${instagram_handle ? `<a href="https://instagram.com/${instagram_handle}"><i class="fab fa-instagram"></i></a>` : ''}
                </div>
                <!-- <a href="#" class="btn btn-secondary">More Info</a> -->
            </div>
            <div class="mapbox">
               <!-- ${generateMapString(mapString)} -->
            </div>
          </div>`;
    }

    generateMapString = (address) => {
        if (address.slice(0, 5) === 'P. O.') {
            // return early if PO box
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
}); 