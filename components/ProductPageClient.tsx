"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageCircle, 
  UserPlus, 
  Phone, 
  MapPin, 
  Star, 
  Mail as MailIcon,
  CheckCircle,
  Users,
  UserCheck,
  Package,
  Building2,
  Sprout,
  Loader2
} from "lucide-react";

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const categories = ["All", "Drones", "Tractors", "Robots"];

export default function ProductPageClient() {
  // State for data
  const [farmers, setFarmers] = useState<any[]>([]);
  const [experts, setExperts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [dealers, setDealers] = useState<any[]>([]);
  const [seedsAndFertilizers, setSeedsAndFertilizers] = useState<any[]>([]);
  
  // State for UI
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showSoilTestModal, setShowSoilTestModal] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<any | null>(null);
  const [showLearnMore, setShowLearnMore] = useState(false);
  
  // Loading states
  const [loading, setLoading] = useState({
    farmers: false,
    experts: false,
    products: false,
    dealers: false,
    seeds: false
  });
  
  // Error states
  const [errors, setErrors] = useState({
    farmers: "",
    experts: "",
    products: "",
    dealers: "",
    seeds: ""
  });

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // API Functions
  const fetchFarmers = async () => {
    setLoading(prev => ({ ...prev, farmers: true }));
    setErrors(prev => ({ ...prev, farmers: "" }));
    try {
      const response = await fetch(`${API_BASE_URL}/farmers`);
      if (!response.ok) throw new Error('Failed to fetch farmers');
      const data = await response.json();
      setFarmers(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, farmers: error instanceof Error ? error.message : 'Unknown error' }));
    } finally {
      setLoading(prev => ({ ...prev, farmers: false }));
    }
  };

  const fetchExperts = async () => {
    setLoading(prev => ({ ...prev, experts: true }));
    setErrors(prev => ({ ...prev, experts: "" }));
    try {
      const response = await fetch(`${API_BASE_URL}/experts`);
      if (!response.ok) throw new Error('Failed to fetch experts');
      const data = await response.json();
      setExperts(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, experts: error instanceof Error ? error.message : 'Unknown error' }));
    } finally {
      setLoading(prev => ({ ...prev, experts: false }));
    }
  };

  const fetchProducts = async () => {
    setLoading(prev => ({ ...prev, products: true }));
    setErrors(prev => ({ ...prev, products: "" }));
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, products: error instanceof Error ? error.message : 'Unknown error' }));
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const fetchDealers = async () => {
    setLoading(prev => ({ ...prev, dealers: true }));
    setErrors(prev => ({ ...prev, dealers: "" }));
    try {
      const response = await fetch(`${API_BASE_URL}/dealers`);
      if (!response.ok) throw new Error('Failed to fetch dealers');
      const data = await response.json();
      setDealers(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, dealers: error instanceof Error ? error.message : 'Unknown error' }));
    } finally {
      setLoading(prev => ({ ...prev, dealers: false }));
    }
  };

  const fetchSeedsAndFertilizers = async () => {
    setLoading(prev => ({ ...prev, seeds: true }));
    setErrors(prev => ({ ...prev, seeds: "" }));
    try {
      const response = await fetch(`${API_BASE_URL}/products?category=Seeds`);
      if (!response.ok) throw new Error('Failed to fetch seeds and fertilizers');
      const data = await response.json();
      setSeedsAndFertilizers(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, seeds: error instanceof Error ? error.message : 'Unknown error' }));
    } finally {
      setLoading(prev => ({ ...prev, seeds: false }));
    }
  };

  // Action Functions
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreServices = () => {
    scrollToSection('connect-farmers');
  };

  const handleLearnMore = () => {
    setShowLearnMore(!showLearnMore);
  };

  const handleViewFarmerProfile = (farmer: any) => {
    alert(`Farmer Profile: ${farmer.user?.name || 'Unknown'}\n\nLocation: ${farmer.location}\nCrop Type: ${farmer.crop_type}\nFarm Size: ${farmer.farm_size} ${farmer.farm_size_unit}\n\nContact:\nEmail: ${farmer.user?.email}\nPhone: ${farmer.user?.phone}`);
  };

  const handleMessageFarmer = (farmer: any) => {
    alert(`Message feature coming soon!\n\nYou can contact ${farmer.user?.name || 'this farmer'} at:\nEmail: ${farmer.user?.email}\nPhone: ${farmer.user?.phone}`);
  };

  const handleConnectFarmer = (farmer: any) => {
    alert(`Connection request sent to ${farmer.user?.name || 'this farmer'}!\n\nThey will be notified of your interest in connecting.`);
  };

  const handleBookConsultation = (expert: any) => {
    setSelectedExpert(expert);
    setShowConsultationModal(true);
  };

  const handleViewProduct = (product: any) => {
    alert(`Product: ${product.name}\n\nCategory: ${product.category}\nPrice: ${product.price} ${product.currency}/${product.unit}\nDescription: ${product.description}\n\nStock: ${product.stock_quantity} available`);
  };

  const handleOrderProduct = (product: any) => {
    alert(`Order ${product.name}\n\nThis feature will allow you to place orders for products. Coming soon!\n\nProduct: ${product.name}\nPrice: ${product.price} ${product.currency}/${product.unit}`);
  };

  const handleViewDealer = (dealer: any) => {
    alert(`Dealer: ${dealer.company_name}\n\nLocation: ${dealer.location}\nSpecialization: ${dealer.specialization}\nDescription: ${dealer.description}\n\nContact:\nEmail: ${dealer.user?.email}\nPhone: ${dealer.user?.phone}`);
  };

  const handleContactDealer = (dealer: any) => {
    alert(`Contact ${dealer.company_name}\n\nEmail: ${dealer.user?.email}\nPhone: ${dealer.user?.phone}\nLocation: ${dealer.location}`);
  };

  const handleBookSoilTest = () => {
    setShowSoilTestModal(true);
  };

  const handleOrderSeeds = () => {
    alert('Order Seeds & Fertilizers\n\nThis feature will allow you to browse and order seeds, fertilizers, and other agricultural inputs. Coming soon!');
  };

  const handleBeFirstFarmer = () => {
    // Navigate to registration page
    window.location.href = '/register?type=farmer';
  };

  // Load data on component mount
  useEffect(() => {
    fetchFarmers();
    fetchExperts();
    fetchProducts();
    fetchDealers();
    fetchSeedsAndFertilizers();
  }, []);

  return (
    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Agriculture Solutions
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Connect with farmers, experts, and access cutting-edge agricultural technology
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={handleExploreServices}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Explore Services
          </button>
          <button 
            onClick={handleLearnMore}
            className="border border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            {showLearnMore ? 'Show Less' : 'Learn More'}
          </button>
        </div>
      </section>

      {/* Learn More Toggle Section */}
      {showLearnMore && (
        <section className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              About SLAM Robotics Agriculture Platform
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Mission</h3>
                <p className="text-gray-600 mb-4">
                  We're revolutionizing agriculture by connecting farmers with cutting-edge technology, 
                  expert knowledge, and essential resources to maximize productivity and sustainability.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What We Offer</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Direct farmer connections and knowledge sharing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Expert agricultural consultations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Advanced machinery and drone technology
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Professional soil testing services
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Quality seeds and fertilizers
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Choose Us</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">🤝 Community-Driven</h4>
                    <p className="text-sm text-gray-600">Connect with experienced farmers and share knowledge across India.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">🚀 Technology-First</h4>
                    <p className="text-sm text-gray-600">Access the latest agricultural technology and automation solutions.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">🎯 Expert Support</h4>
                    <p className="text-sm text-gray-600">Get personalized advice from certified agricultural experts.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">📈 Sustainable Growth</h4>
                    <p className="text-sm text-gray-600">Optimize your farm for maximum productivity and environmental responsibility.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-8">
              <button 
                onClick={() => scrollToSection('connect-farmers')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Start Your Agricultural Journey
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 👨‍🌾 Connect with Farmers */}
      <section id="connect-farmers" className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            👨‍🌾 Connect with Farmers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect directly with experienced farmers across India. Share knowledge, collaborate, and grow together.
          </p>
        </div>

        {loading.farmers ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Loading farmers...</p>
          </div>
        ) : errors.farmers ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Error: {errors.farmers}</p>
            <button 
              onClick={fetchFarmers}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Retry
            </button>
          </div>
        ) : farmers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {farmers.map((farmer) => (
              <Card key={farmer.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={farmer.image_url || "/farming_robots.jpg"}
                    alt={farmer.user?.name || 'Farmer'}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <div className={`w-3 h-3 rounded-full ${farmer.is_online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{farmer.rating || 0}</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{farmer.user?.name || 'Farmer'}</h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{farmer.location}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{farmer.crop_type}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewFarmerProfile(farmer)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => handleMessageFarmer(farmer)}
                      className="px-3 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleConnectFarmer(farmer)}
                      className="px-3 py-2 border border-green-600 text-green-600 hover:bg-green-50 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Farmers Available Yet</h3>
            <p className="text-gray-500 mb-6">Farmers will appear here once they register on the platform.</p>
            <button 
              onClick={handleBeFirstFarmer}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Be the First Farmer
            </button>
          </div>
        )}
      </section>

      {/* 🧑‍🔬 Talk to Our Farm Experts */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🧑‍🔬 Talk to Our Farm Experts
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get expert advice from agricultural specialists. Book consultations for soil testing, crop planning, and more.
          </p>
        </div>

        {loading.experts ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Loading experts...</p>
          </div>
        ) : errors.experts ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Error: {errors.experts}</p>
            <button 
              onClick={fetchExperts}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Retry
            </button>
          </div>
        ) : experts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert) => (
              <Card key={expert.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={expert.image_url || "/farming_robots.jpg"}
                    alt={expert.user?.name || 'Expert'}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{expert.rating || 0}</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{expert.user?.name || 'Expert'}</h3>
                  <p className="text-sm text-blue-600 font-semibold mb-2">{expert.domain}</p>
                  <p className="text-sm text-gray-600 mb-3">{expert.experience}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-green-600">₹{expert.consultation_fee}</span>
                    <span className="text-sm text-gray-500">{expert.total_consultations || 0} consultations</span>
                  </div>
                  <button 
                    onClick={() => handleBookConsultation(expert)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                  >
                    Book Consultation
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Experts Available Yet</h3>
            <p className="text-gray-500 mb-6">Agricultural experts will appear here once they register on the platform.</p>
            <button 
              onClick={() => window.location.href = '/register?type=expert'}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Register as Expert
            </button>
          </div>
        )}
      </section>

      {/* 🚜 Browse Machinery, Drones & Robots */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🚜 Browse Machinery, Drones & Robots
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore cutting-edge agricultural technology. From drones to autonomous tractors, find the perfect equipment.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                selectedCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading.products ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : errors.products ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Error: {errors.products}</p>
            <button 
              onClick={fetchProducts}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={product.image_url || "/farming_robots.jpg"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <span className="text-sm font-semibold text-gray-700">{product.category}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{product.rating || 0}</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                    <span className="text-sm text-gray-500">{product.stock_quantity} in stock</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewProduct(product)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleOrderProduct(product)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Order Now
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Available Yet</h3>
            <p className="text-gray-500 mb-6">Agricultural machinery and equipment will appear here once added to the platform.</p>
            <button 
              onClick={() => window.location.href = '/register?type=dealer'}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Register as Dealer
            </button>
          </div>
        )}
      </section>

      {/* 🏢 Connect with Dealers */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🏢 Connect with Dealers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find authorized dealers for agricultural equipment, machinery, and technology solutions.
          </p>
        </div>

        {loading.dealers ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Loading dealers...</p>
          </div>
        ) : errors.dealers ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Error: {errors.dealers}</p>
            <button 
              onClick={fetchDealers}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Retry
            </button>
          </div>
        ) : dealers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dealers.map((dealer) => (
              <Card key={dealer.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={dealer.image_url || "/farming_robots.jpg"}
                    alt={dealer.company_name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{dealer.rating || 0}</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{dealer.company_name}</h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{dealer.location}</span>
                  </div>
                  <p className="text-sm text-blue-600 font-semibold mb-2">{dealer.specialization}</p>
                  <p className="text-sm text-gray-600 mb-4">{dealer.description}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewDealer(dealer)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleContactDealer(dealer)}
                      className="flex-1 border border-green-600 text-green-600 hover:bg-green-50 py-2 px-3 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Contact
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Dealers Available Yet</h3>
            <p className="text-gray-500 mb-6">Authorized dealers will appear here once they register on the platform.</p>
            <button 
              onClick={() => window.location.href = '/register?type=dealer'}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Register as Dealer
            </button>
          </div>
        )}
      </section>

      {/* 🌱 Book Soil Test & Farm Planning */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🌱 Book Soil Test & Farm Planning
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get professional soil testing and farm planning services to optimize your agricultural productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="text-center p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sprout className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Soil Testing</h3>
            <p className="text-gray-600 mb-4">Comprehensive soil analysis for optimal crop selection and fertilization.</p>
            <button 
              onClick={handleBookSoilTest}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Book Now
            </button>
          </Card>

          <Card className="text-center p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Farm Planning</h3>
            <p className="text-gray-600 mb-4">Expert consultation for crop planning and farm optimization strategies.</p>
            <button 
              onClick={() => alert('Farm Planning consultation booking coming soon!')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Book Now
            </button>
          </Card>

          <Card className="text-center p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Consultation</h3>
            <p className="text-gray-600 mb-4">One-on-one sessions with agricultural experts for personalized advice.</p>
            <button 
              onClick={() => scrollToSection('connect-farmers')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Find Experts
            </button>
          </Card>
        </div>
      </section>

      {/* 🛒 Order Seeds & Fertilizers */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🛒 Order Seeds & Fertilizers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse and order high-quality seeds, fertilizers, and other agricultural inputs for your farm.
          </p>
        </div>

        {loading.seeds ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : errors.seeds ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Error: {errors.seeds}</p>
            <button 
              onClick={fetchSeedsAndFertilizers}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Retry
            </button>
          </div>
        ) : seedsAndFertilizers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {seedsAndFertilizers.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={product.image_url || "/farming_robots.jpg"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{product.rating || 0}</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                    <span className="text-sm text-gray-500">{product.stock_quantity} in stock</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewProduct(product)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleOrderProduct(product)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Order Now
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Seeds & Fertilizers Available Yet</h3>
            <p className="text-gray-500 mb-6">High-quality seeds and fertilizers will appear here once added to the platform.</p>
            <button 
              onClick={() => window.location.href = '/products'}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Catalog
            </button>
          </div>
        )}
      </section>

      {/* Consultation Modal */}
      {showConsultationModal && selectedExpert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Book Consultation</h3>
            <p className="text-gray-600 mb-4">Book a consultation with {selectedExpert.user?.name || 'Expert'}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={consultationForm.serviceType}
                  onChange={(e) => setConsultationForm(prev => ({ ...prev, serviceType: e.target.value }))}
                >
                  <option value="">Select service</option>
                  <option value="soil_testing">Soil Testing</option>
                  <option value="crop_planning">Crop Planning</option>
                  <option value="pest_management">Pest Management</option>
                  <option value="irrigation">Irrigation</option>
                  <option value="general">General Consultation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                <input 
                  type="date" 
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={consultationForm.preferredDate}
                  onChange={(e) => setConsultationForm(prev => ({ ...prev, preferredDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea 
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Any specific questions or requirements..."
                  value={consultationForm.notes}
                  onChange={(e) => setConsultationForm(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowConsultationModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert('Consultation booking feature coming soon!');
                  setShowConsultationModal(false);
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Soil Test Modal */}
      {showSoilTestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Book Soil Test</h3>
            <p className="text-gray-600 mb-4">Schedule a professional soil testing service for your farm.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Farm Location</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter your farm location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                <input 
                  type="date" 
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input 
                  type="tel" 
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Your contact number"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowSoilTestModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert('Soil test booking feature coming soon!');
                  setShowSoilTestModal(false);
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 