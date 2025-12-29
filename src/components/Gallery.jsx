import { useState } from 'react';
import heroBg from '../assets/b-g.jpg';
import hunzaImg from '../assets/gal1.jpg';
import hunzaImg1 from '../assets/gal2.jpg';
import hunzaImg2 from '../assets/gal3.jpg';
import hunzaImg3 from '../assets/gal4.jpg';
import hunzaImg4 from '../assets/gal5.jpg';
import hunzaImg5 from '../assets/gal6.jpg';

// Sample client review images (replace with your actual image paths)
const clientReviews = [
  {
    id: 1,
    image: hunzaImg,  // Replace with actual image paths
    name: 'University-Trip to Raiwind',
    review: 'Amazing experience with Travel with Kabir! The tour was well-organized and the guides were knowledgeable.'
  },
  {
    id: 2,
    image: hunzaImg1,
    name: 'To Shogran Valley',
    review: 'Best travel experience ever! Will definitely book again.'
  },
  {
    id: 3,
    image: hunzaImg2,
    name: 'To Naran',
    review: 'The team went above and beyond to make our trip memorable.'
  },
  {
    id: 4,
    image: hunzaImg3,
    name: 'To Babusar Top',
    review: 'Excellent service and attention to detail. Highly recommended!'
  },
  {
    id: 5,
    image: hunzaImg4,
    name: 'To Azad-Kashmir',
    review: 'Smooth booking process and fantastic guides. 5 stars!'
  },
  {
    id: 6,
    image: hunzaImg5,
    name: 'To Lalazar Meadows',
    review: 'Unforgettable memories made with Travel with Kabir.'
  },
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section
      id="gallery"
      className="relative overflow-hidden min-h-screen"
    >
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          transform: 'scale(1.05)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(255, 248, 201, 0.35)' }}
      />

      <div className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Client Reviews & Testimonials
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              See what our clients have to say about their experiences with us
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientReviews.map((review) => (
              <div 
                key={review.id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => setSelectedImage(review)}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={review.image} 
                    alt={`Review by ${review.name}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{review.name}</h3>
                  <p className="mt-2 text-gray-600 line-clamp-2">{review.review}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-white rounded-lg overflow-hidden">
              <img 
                src={selectedImage.image} 
                alt={`Review by ${selectedImage.name}`}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900">{selectedImage.name}</h3>
                <p className="mt-2 text-gray-700">{selectedImage.review}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
