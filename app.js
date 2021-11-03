//1) Invocar a Express
const express = require('express');
const app = express();

//2) Setear datos del formulario y urlencoded
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//3) Invocar a Dotenv
const dotenv = require('dotenv');
dotenv.config({path: './env/.env'});

//4) Directorio public
app.use('/resources',express.static('public'));
app.use('/resources',express.static(__dirname + '/public'));

//5) Establecer motor de plantillas
app.set('view engine', 'ejs');

//6)Invocar a bcryptjs para hashing(encriptar) passwords
const bcryptjs = require('bcryptjs');

//7) Variables de Sesión
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//8) Invocar al módulo de la conexión
const connection = require('./database/db');

//9) Establecer las rutas
    app.get('/',(req,res)=>{ //Ruta de inicio
        res.render('index',{msg:'Mensaje desde node '});
    });
    app.get('/login',(req,res)=>{ //Ruta de login
        res.render('login');
    });
    app.get('/register',(req,res)=>{7//Ruta de registro
        res.render('register');
    });

//10 Registración
app.post('/register',async(req,res)=>{
    const user = req.body.user; //Captura el valor del body de la página
    const name = req.body.name;
    const pass = req.body.pass;
    const rol = req.body.rol;
    let passwordHash = await bcryptjs.hash(pass,8)//ciclo de 8 iteraciones
    connection.query('INSERT INTO users SET ?',{user:user, name:name, rol:rol, pass:passwordHash}, async(error,results)=>{
    //Sentencia sql para insertar datos en la tabla con password encriptada    
        if(error){
            console.log(error);
        }else{
            res.render('register',{
                alert:true, //Confirmar
                alertTitle:'Registration', //Darle estilos a la alerta
                alertMessage: '¡Successful Registration!',
                alertIcon: 'success',
                showConfirmButton: false,
                time: 1500,

            });
        };
    });
    
});

app.listen(3000, (req,res) =>{
    console.log('Server is running');
});