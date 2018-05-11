// This movies' data should be saved in the DB, for simplest usage, here use local variable to do this
const topmovies = [
    {'score':4.5, 'picture':'thumb-review.jpg', 'name':'杀破狼 贪狼'},
    {'score':4.5, 'picture':'thumb-review2.jpg', 'name':'昆塔：反转星球'},
    {'score':4.5, 'picture':'thumb-review3.jpg', 'name':'维京：王者之战'},
    {'score':4.5, 'picture':'thumb-review4.jpg', 'name':'心理罪'},
    {'score':4.5, 'picture':'thumb-review5.jpg', 'name':'七十七天'},
    {'score':4.5, 'picture':'thumb-review6.jpg', 'name':'破局'},
    {'score':4.5, 'picture':'thumb-review7.jpg', 'name':'德州杀场'},
    {'score':4.5, 'picture':'thumb-review8.jpg', 'name':'再造战士'},
    {'score':4.5, 'picture':'thumb-review9.jpg', 'name':'流星的启示'},
    {'score':4.5, 'picture':'thumb-review10.jpg', 'name':'危情8小时'},
    {'score':4.5, 'picture':'thumb-review11.jpg', 'name':'噬人鲨大战食人鳄'},
    {'score':4.5, 'picture':'thumb-review12.jpg', 'name':'入侵地球'},
]

const popMovies = [
    {'score':"20,895", 'picture':'thumb-s2.jpg',  'name':'雪国列车'},
    {'score':"20,895", 'picture':'thumb-s3.jpg',  'name':'倚天屠龙记之魔教教主'},
    {'score':"20,895", 'picture':'thumb-s4.jpg',  'name':'唐人街探案2'},
    {'score':"20,895", 'picture':'thumb-s5.jpg',  'name':'小萝莉的神猴大叔'},
    {'score':"20,895", 'picture':'thumb-s6.jpg',  'name':'金刚'},
    {'score':"20,895", 'picture':'thumb-s7.jpg',  'name':'莫斯科陷落'},
    {'score':"20,895", 'picture':'thumb-s8.jpg',  'name':'烟花'},
    {'score':"20,895", 'picture':'thumb-s9.jpg',  'name':'花芯'},
    {'score':"20,895", 'picture':'thumb-s10.jpg', 'name':'深渊'},
    {'score':"20,895", 'picture':'thumb-s11.jpg', 'name':'后天'},
    {'score':"20,895", 'picture':'thumb-s12.jpg', 'name':'异形3'},
    {'score':"20,895", 'picture':'thumb-s13.jpg', 'name':'猫妖传'},
]

function list_movies(movies, display) {
    if (!movies) {
        return [];
    }

    if (!display) {
        display = 6;
    }

    const total = movies.length;
    const loop = Math.ceil(total/display);
    var movie_group = [];
    var result = [];

    for (var index = 0; index < loop; index++) {
        if (loop-1 === index){
            movie_group = movies.slice(index*display, total);
        }
        else {
            movie_group = movies.slice(index*display, (index+1)*display);
        }

        result.push(movie_group);
    }

    return result;
}

/* GET home page. */
exports.index = function(req, res) {
    console.log('render index.html');
    res.render('index', {
                topmovies: list_movies(topmovies),
                popmovies: popMovies
    });
};


exports.play = function(req, res) {

    var movieParser = function(url) {
        if (url && url.match(/\/play\?movie=/)) {
            var temp = {};
            temp.name = url.split("=")[1];
            if (temp.name.match(/\.mp4/)) {
                temp.type = 'mp4'
            } else if (temp.name.match(/\.webm/)) {
                temp.type = 'webm'
            } else {
                return null
            }

            temp.name = '/videos/' + temp.name;
            temp.type = 'type/' + temp.type;

            return temp;
        }

        return null;
    }

    console.log(req.originalUrl);

    var movie = movieParser(req.originalUrl);
    if (movie) {
        res.render('play', {
                    movie: movie
        });
    } else {
        res.redirect('/');
    }
};

