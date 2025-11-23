import 'dotenv/config'; 
import { db } from '../db/db.js';
import { 
  users, 
  franchisors, 
  franchiseListings, 
  investmentMetrics, 
  categories, 
  franchiseCategories, 
  reviews, 
  media, 
  packageAndSupport 
} from '../models/index.js'; 
import { eq, sql } from 'drizzle-orm';

//data dummy
const LISTING_ID_KOPI = 'a1b2c3d4-0000-0000-0000-00000000000a';
const CATEGORY_MINUMAN_ID = 'b1b2c3d4-0000-0000-0000-00000000000b';
const CATEGORY_MAKANAN_ID = 'b1b2c3d4-0000-0000-0000-00000000000c';
const EMAIL_MITRA = 'mitra3@gmail.com';
const EMAIL_USER_BIASA = 'testlogin@gmail.com';
const LISTING_NAME = 'Kopi Senja 2';

async function seedDatabase() {
  console.log('Memulai seeder database');

  let MITRA_ID;
  let USER_BIASA_ID;

  try {
    const existingMitra = await db.select({ userId: users.userId }).from(users).where(eq(users.email, EMAIL_MITRA));
    const existingUser = await db.select({ userId: users.userId }).from(users).where(eq(users.email, EMAIL_USER_BIASA));

    if (existingMitra.length === 0 || existingUser.length === 0) {
      console.error('❌ Data Kunci (Mitra atau User Biasa) tidak ditemukan di tabel users.');
      console.log('Silakan jalankan pendaftaran manual atau insert data user/mitra terlebih dahulu.');
      process.exit(1);
    }

    MITRA_ID = existingMitra[0].userId;
    USER_BIASA_ID = existingUser[0].userId;
        
    console.log(`   [Berhasil] Mitra ID: ${MITRA_ID}`);

    //insert category
    console.log('Memasukkan kategori');
    await db.insert(categories).values([
      {categoryId: CATEGORY_MINUMAN_ID, categoryName: 'Minuman'},
      {categoryId: CATEGORY_MAKANAN_ID, categoryName: 'Makanan'},
      {categoryId: 'b1b2c3d4-0000-0000-0000-00000000000d', categoryName: 'Jasa'}
    ]);

    //insert franchise listings
    console.log('Memasukkan franchise listings');
    await db.insert(franchiseListings).values({
      listingId: LISTING_ID_KOPI,
      franchisorId: MITRA_ID,
      listingName: LISTING_NAME,
      slogan: 'Waralaba kopi paling hits',
      description: 'Deskripsi lengkap waralaba Kopi Senja',
      location: 'Jakarta',
      status: 'Active',
      views: 1200
    });

    //insert investment metrics
    console.log('6. Memasukkan Investment Metrics...');
    await db.insert(investmentMetrics).values({
      listingId: LISTING_ID_KOPI,
      initialCapitalMin: 50000000,
      initialCapitalMax: 150000000,
      royaltyFeePercent: 5.00,
      estimatedBepMonthsMin: 6,
      estimatedBepMonthsMax: 12
    });

    //insert franchise categories
    console.log('Memasukkan franchise categories');
    await db.insert(franchiseCategories).values([
      {listingId: LISTING_ID_KOPI, categoryId: CATEGORY_MINUMAN_ID},
      {listingId: LISTING_ID_KOPI, categoryId: CATEGORY_MAKANAN_ID}
    ]);

    //insert reviews
    console.log('Memasukkan reviews');
    await db.insert(reviews).values({
      listingId: LISTING_ID_KOPI,
      userId: USER_BIASA_ID,
      rating: 5,
      reviewText: 'Bisnis sangat menjanjikan',
    });

    //insert media
    console.log('Memasukkan media');
    await db.insert(media).values([
      {listingId: LISTING_ID_KOPI, mediaUrl: 'https://img.com/kopi1.jpg', mediaType: 'image'}
    ]);

    if (media.length > 0) {
      console.log('success');
    }

    console.log('Seeder selesai');
  } catch (error) {
    console.error('FATAL error saat seeding');
    process.exit(1);
  } finally {

  }
}

seedDatabase();