/* Kuntal Upadhyay
upad0018
-----------------Project 2--------------------
*/
/* Refrences :
// https://www.youtube.com/watch?v=wlVmmsMD28w&t=666s
https://gist.github.com/prof3ssorSt3v3/f00d99fb69272fc2e0e4f4dd46e89f41
https://github.com/prof3ssorSt3v3/simple-spa-demo 
Old code from Project 1*/


const app = 
{
    searchQuery: null,
    actorData: [],
    movieID: null,
    baseURL: null,
    imageBaseURL: "https://image.tmdb.org/t/p/", //default image link. //https://developers.themoviedb.org/3/getting-started/images
    pages: [],
    active: null,


    apiKey: 'a5d7a1d6df055d83cdad7408637a278b',
    //initalized the apiKey so that we don't have to keep writing apiKey again and again.

    init: () => 
    {
        console.log("Welcome to the App");
        //if we have a look in the console of the web browser this message will be displayed.
        app.active = document.getElementById('find');
        //it will get the element of the given name from the file and start the fucntion
        app.updatePages();
        document.getElementById('back').addEventListener('click', ev =>
        {
            app.changePage(document.getElementById('find'));
        });
        document.getElementById('find1').addEventListener('click', app.search);
        app.baseURL = location.href.split('#')[0];
        let hash = location.hash;

        if(hash && hash != '#')
        {
            app.changePage(document.getElementById(hash.replace("#","")));
        } else
        {
            history.replaceState({},app.active.id, `${app.baseURL}#${app.active.id}`);
        }

        window.addEventListener('popstate', app.backButton);
        //actual parsing of the website begins as we type the name of any actor we want to find.

    },
    removeElements: parent => 
    {
        if(parent.firstChild)
        {
            while(parent.firstChild)
            {
                parent.removeChild(parent.firstChild);
            }
        }
    },

    buildTitle: (title, parent) => 
    {
        let p = document.createElement('h3');
        p.textContent = title;
        parent.appendChild(p);
    },
    //this defines the title and parent of the image

    buildElement: (text, element, parent) => 
    {
        let p = document.createElement(`${element}`);
        p.textContent = text;
        parent.appendChild(p);
    },
    //moive size parent are for the name of the movie size of the photo to be displayed and parent class respectively.
    buildMovieImage: (movie, size, parent) =>
    {
        let width = `w${size}/`;
        
        let poster = document.createElement('img');
        poster.title = movie.tagline;
        poster.alt = movie.tagline;
        if(movie.poster_path)
        {
            poster.src = app.imageBaseURL + width + movie.poster_path;
            //so if the image will be available it will display the image from the link we have initialized at the starting of the code.
        } 
        else
        {
            //if nothing works the image in my image folder will be displayed.
            poster.src = "img/error.jpg";
        }
        parent.appendChild(poster);
        },
        //same goes with this function actor size and parent will display actor image the size of the picture from parent.
    buildActorImage: (actor, size, parent) => 
    {
        let width = `w${size}`;
        let poster = document.createElement('img');
        poster.title = actor.name;
        poster.alt = actor.name;
        if(actor.profile_path){
            poster.src = app.imageBaseURL + width + actor.profile_path;
        } //defined the path that if the image is avaliable the server will respond by displaying the image from the link we have defined
        //at the staring of the code.
        else 
        {
            poster.src = "img/error.jpg";
        } //if not then this image from my folder will be displayed.
        parent.appendChild(poster);
    },
    changePage: newPage=>
    {
            //history method remembers what user did through out browsing the webpage and will trigger pushstate if user hits back button
            //reference : https://www.youtube.com/watch?v=wlVmmsMD28w&t=666s    
        history.pushState({}, newPage.id, `${app.baseURL}#${newPage.id}`); 
        app.active.classList.toggle('active');
        app.active = newPage;
        newPage.classList.toggle('active');
        window.scrollTo(0,0);
        //scrollto will scroll the page while being on the same page and "smooth" is the effect of scroll.
    },
    buildActorPage: ev => 
    
    {
        ev.preventDefault();
        ev.stopPropagation();
        let output = document.getElementById('actors');
        app.removeElements(output);
        app.changePage(output);
        app.buildTitle("Movies by: " + ev.currentTarget.getAttribute("data-actorname"), output);
        console.log(ev.currentTarget.getAttribute("data-actornum"));
        app.buildActorImage(app.actorData[ev.currentTarget.getAttribute("data-actornum")], 300, output);
        app.actorData[ev.currentTarget.getAttribute("data-actornum")].known_for.forEach(movie => {
            let movieDiv = document.createElement('div');
            movieDiv.classList.add('movie');
            let testMovies = document.createElement('p');
            console.log(movie);
            switch(movie.media_type){
                case "tv":
                    testMovies.textContent = movie.id + " " + movie.name;
                    movieDiv.classList.add("tv");
                    break;
                case "movie":
                    testMovies.textContent = movie.id + " " + movie.title;
                    break;
            }
            //this will look for the following : that if the thing is movie or a webseries/series.
            //and display accordingly
            movieDiv.setAttribute("data-movieid", movie.id);
            movieDiv.addEventListener('click', app.buildMoviePage);
            movieDiv.appendChild(testMovies);
            app.buildMovieImage(movie, 200, movieDiv);
            output.appendChild(movieDiv);
        })
    },
    processMovies: moviePromise => 
    //if it is movie then this section will help display the cast members and will display the released date, genre and team member names.
    //but it does not works for me i trid but cannot figure it out.
    {
        let output = document.getElementById('movies');
        moviePromise.then(data => {
            console.log(data);
            if(data.team)
            {
                output = document.getElementById('team');
                app.removeElements(output);
                app.buildTitle("Team Members:", output);
                data.cast.forEach(member => {
                    app.buildActorImage(member, 200, output);
                    app.buildElement(`team #${member.team_id} ${member.name} | Character in movie: ${member.character}`, 'p', output);

                });
                console.log("team data:", data.team); 
            } 
            else 
            {
                output = document.getElementById('details');
                //details about that particular movie like released date and genre.
                app.removeElements(output);
                console.log("movie data", data);
                app.buildTitle(`Released: ${data.release_date} Title: ${data.title}`, output);
                let genreText = document.createElement('p');
                genreText.textContent = "Genres: ";
                if(data.genres){
                    data.genres.forEach(genre =>
                        {
                        genreText.textContent += genre.name + " ";
                        });
                    output.appendChild(genreText);
                } 
                else 
                {
                    genreText += "Not Found";
                    //if any of the data is not found then it will display undefined.
                    app.removeElements(document.getElementById('team'));
                    app.buildTitle("Cast Members: ", document.getElementById('team'));
                }
                app.buildMovieImage(data, 200, output);
        }})
        .catch(err =>{
            console.log("error occured:",err.message); //error message.

        })
        app.changePage(output);
        console.log(moviePromise);
    },
    buildTvPage: tvData=>
    {           //if it is tv series/web series.
        //displays different attributes like name, original date (when it was first on AIR), name of the director and more attributes that have been defined.
        let output = document.getElementById('movies');
        let movieDiv = document.getElementById('details');
        let castDiv = document.getElementById('team');
        app.removeElements(movieDiv);
        app.removeElements(castDiv);
        app.buildTitle(tvData.name, movieDiv);
        app.buildElement("Original Air Date: " + tvData.first_air_date,"p",movieDiv);
        app.buildMovieImage(tvData, 200,movieDiv);
        app.buildElement(tvData.overview, "p", movieDiv);

        app.buildTitle(`Created By:\n `,castDiv);
        tvData.created_by.forEach(director =>{
            app.buildElement(director.name,'p', castDiv);
            app.buildActorImage(director, 200, castDiv);
        })
        app.changePage(output);
    },
    buildMoviePage: ev => 
    {
        ev.preventDefault();
        ev.stopPropagation();
        app.movieID = ev.currentTarget.getAttribute("data-movieid");
        if(ev.currentTarget.classList.contains("serial"))
        {
            let tvUrl = `https://api.themoviedb.org/3/tv/${app.movieID}?api_key=${app.apiKey}`;
            fetch(tvUrl)
                .then(response => response.json())
                .then(app.buildTvPage)
                .catch(err =>
                    {
                    console.log(err.message);     //error message if the data is not fetched and error occurs
                    })
        } 
        else 
        {
            let movieUrl = fetch(`https://api.themoviedb.org/3/movie/${app.movieID}?api_key=${app.apiKey}`);
            let castURL = fetch(`https://api.themoviedb.org/3/movie/${app.movieID}/credits?api_key=${app.apiKey}`);

            let requests = [movieUrl, castURL]; 
            Promise.all(requests)
                .then(movies => 
                    {
                    movies.forEach(movie => 
                        {
                        app.processMovies(movie.json());
                        })
                    })
                .catch(err => 
                    {
                    console.log(err.message);
                    })
        }
    },
    search: ev => 
    {
        ev.preventDefault();
        ev.stopPropagation();
        let output = document.getElementById('result');
        app.changePage(output);
        app.removeElements(output);
        app.active = output;

        app.searchQuery = document.getElementById('hero').value;
        console.log("You searched:",app.searchQuery);

        app.buildTitle("You Searched: " + app.searchQuery, output);
        document.querySelector('form').reset();
        if(app.searchQuery)
        {
            let url = `https://api.themoviedb.org/3/search/person?api_key=${app.apiKey}&query=${app.searchQuery}`;
            fetch(url)
                .then(response => response.json())
                .then(data => 
                    {
                    data.results.forEach(actor => 
                        {
                        let actorDiv = document.createElement('div');
                        actorDiv.classList.add('actor');

                        app.buildActorImage(actor, 200, actorDiv);
                        let d = document.createElement('p');
                        d.textContent = actor.name;
                        app.actorData.push(actor);
                        actorDiv.setAttribute("data-actornum",app.actorData.length-1 );
                        actorDiv.setAttribute("data-actorname", actor.name);
                        actorDiv.addEventListener('click', app.buildActorPage);
                        actorDiv.appendChild(d);
                        output.appendChild(actorDiv);
                        })
                    })
                .catch(err => 
                    {
                    console.log(err.message);
                    });
            }
        },
    backButton: ev => 
    { //back button
        ev.preventDefault();
        ev.stopPropagation();
        app.updatePages();

        switch(app.active)
        {
            case app.pages[0]:
                app.changePage(document.getElementById(location.hash.replace("#","")));
                break;
            case app.pages[1]:
                app.changePage(document.getElementById('find'));
                break;
            case app.pages[2]:
                    app.changePage(document.getElementById('result'));
                break;
            case app.pages[3]:
                app.changePage(document.getElementById('actors'));
                break;
        }
        //switch between pages using back button or back option from servers and going to page whichever user wants.
    },
    updatePages: () => 
    {
        app.pages.push(document.getElementById('find')); 
        app.pages.push(document.getElementById('result'));
        app.pages.push(document.getElementById('actors')); 
        app.pages.push(document.getElementById('movies')); 
    }
    //all the pages will be always be updated everytime we refresh the page because it directly fetch data from the server and not from a database.
}
document.addEventListener('DOMContentLoaded', app.init);