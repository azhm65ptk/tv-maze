/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
const Missing_Image="https://tinyurl.com/tv-missing";

async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
let res=await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`)
let shows= res.data.map(result=>{
  let show=result.show;
  return{
    id:  show.id,
    name: show.name,
    summary: show.summary,
    image: show.image ?  show.image.medium : Missing_Image,
  };
})
  return shows;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-right" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-danger get-episodes"> See Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */


async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
  let res= await axios(`https://api.tvmaze.com/shows/${id}/episodes`);
  let episodes= res.data.map(result =>({
    id: result.id,
    name: result.name,
    season: result.season,
    number: result.number
  }));
  return episodes;
}

function populateEpisode(episodes){
  const $episodeList=$("#episodes-list");
  $episodeList.empty();

  for(let epi of episodes){
    let $item= $(` 
    <li>
    ${epi.name}, season ${epi.season}, episode ${epi.number}
     </li>`);
     $episodeList.append($item);
  }

  $('#episodes-area').show();
}

$('#shows-list').on('click', ".get-episodes", async function(evt){
  let showId= $(evt.target).closest(".Show").data("show-id");
  let episodes= await getEpisodes(showId);
  populateEpisode(episodes);
})

