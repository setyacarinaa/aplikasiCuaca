const path = require('path')
const express = require('express')
const hbs = require('hbs')
const { error } = require('console')
const geocode = require('./utils/geocode')
const forecast = require('./utils/prediksiCuaca')

const app = express()

//mendefinisikan jalur/path untuk konfigurasi express
const direktoriPublic = path.join(__dirname, '../public')
const direktoriViews = path.join(__dirname, '../templates/views')
const direktoriPartials = path.join(__dirname, '../templates/partials')

//setup handlebars engine dan lokasi folder views
app.set('view engine', 'hbs')
app.set('views', direktoriViews)
hbs.registerPartials(direktoriPartials)

//setup direktori statis
app.use(express.static(direktoriPublic))

//ini halaman/page utama
app.get('', (req, res) => {
    res.render('index', {
        judul: 'Aplikasi Cek Cuaca',
        nama: 'Setya Carina Rianti'
    })
})

//ini halaman bantuan/FAQ (Frequently Asked Questions)
app.get('/bantuan', (req, res) => {
    res.render('bantuan', {
        judul: 'Halaman Bantuan',
        nama: 'Setya Carina Rianti',
        teksBantuan: 'Ini adalah teks bantuan'
    })
}) 

//ini halaman infoCuaca
app.get('/infoCuaca', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Kamu harus memasukkan lokasi yang ingin dicari'
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({error})
        }
        forecast(latitude, longitude, (error, dataPrediksi) => {
            if (error){
                return res.send({error})
            }
            res.send({
                prediksiCuaca: dataPrediksi,
                lokasi: location,
                address: req.query.address
            })
        })
    })
})

//ini halaman tentang
app.get('/tentang', (req, res) => {
    res.render('tentang', {
        judul: 'Tentang Saya',
        nama: 'Setya Carina Rianti'
    })
})

app.get('/bantuan/tes', (req, res) => {
    res.render('404', {
        judul: '404',
        nama: 'Setya Carina Rianti',
        pesanKesalahan: 'Artikel yang dicari tidak ditemukan.'
    })
})

app.get('/tes', (req, res) => {
    res.render('404', {
        judul: '404',
        nama: 'Setya Carina Rianti',
        pesanKesalahan: 'Halaman tidak ditemukan.'
    })
})

//ini halaman berita
app.get('/berita', async (req, res) => {
    const axios = require('axios')
    const apiKey = '070fcb8c27aeadea1b13ed76a4f9ff17'

    try {
        const response = await axios.get('http://api.mediastack.com/v1/news', {
            params: {
                access_key: apiKey,
                countries: 'us',  // sementara pakai US biar pasti muncul
                limit: 5
            }
        })
        const berita = response.data.data
        console.log('Data dari API:', berita)

        res.render('berita', {
            judul: 'Berita Terkini',
            nama: 'Setya Carina Rianti',
            berita
        })
    } catch (error) {
        console.error(error)
        res.render('berita', {
            judul: 'Berita Terkini',
            nama: 'Setya Carina Rianti',
            error: 'Gagal memuat berita. Silakan coba lagi nanti.'
        })
    }
})

app.listen(4000, () => {
    console.log('Server berjalan pada port 4000.')
}) 