import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Camera, Check, AlertCircle, 
  ChevronRight, Globe, ShieldCheck, Calendar, User, Edit3, X
} from 'lucide-react';
import { userProfileEngine, UserProfileData } from '../services/userProfileService';
import { toast } from '../services/toastAndErrorService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const COUNTRIES = [
  { name: 'Pakistan', flag: '🇵🇰', code: 'PK' },
  { name: 'Saudi Arabia', flag: '🇸🇦', code: 'SA' },
  { name: 'United Arab Emirates', flag: '🇦🇪', code: 'AE' },
  { name: 'Turkey', flag: '🇹🇷', code: 'TR' },
  { name: 'India', flag: '🇮🇳', code: 'IN' },
  { name: 'Bangladesh', flag: '🇧🇩', code: 'BD' },
  { name: 'United States', flag: '🇺🇸', code: 'US' },
  { name: 'United Kingdom', flag: '🇬🇧', code: 'GB' },
  { name: 'Indonesia', flag: '🇮🇩', code: 'ID' },
  { name: 'Egypt', flag: '🇪🇬', code: 'EG' },
];

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'] as const;

export const EditProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState<UserProfileData>(() => userProfileEngine.getProfile());
  const [initialProfile, setInitialProfile] = useState<UserProfileData>(() => userProfileEngine.getProfile());
  const [isSaving, setIsSaving] = useState(false);

  // Field Edit Dialog Triggers
  const [activeModal, setActiveModal] = useState<'none' | 'username' | 'gender' | 'bio' | 'birthday' | 'country' | 'photoSelect'>('none');
  
  // Field Draft Inputs
  const [tempUsername, setTempUsername] = useState('');
  const [tempGender, setTempGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say'>('Male');
  const [tempBio, setTempBio] = useState('');
  const [tempBirthday, setTempBirthday] = useState('');
  const [tempCountry, setTempCountry] = useState({ name: 'Pakistan', flag: '🇵🇰', code: 'PK' });
  const [countrySearch, setCountrySearch] = useState('');
  
  // Photo slot edit target
  const [selectedPhotoSlot, setSelectedPhotoSlot] = useState<number | 'avatar' | null>(null);

  useEffect(() => {
    if (isOpen) {
      const p = userProfileEngine.getProfile();
      setProfile(p);
      setInitialProfile(p);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hasChanges = JSON.stringify(profile) !== JSON.stringify(initialProfile);

  const handleSave = async () => {
    if (!profile.username.trim()) {
      toast.error('Username cannot be empty.');
      return;
    }

    setIsSaving(true);
    try {
      await new Promise(r => setTimeout(r, 350));
      userProfileEngine.updateProfile(profile.userId, profile);
      setInitialProfile({ ...profile });
      toast.success('Saved successfully');
      onClose();
    } catch (e) {
      toast.error('Failed to update profile details.');
    } finally {
      setIsSaving(false);
    }
  };

  // Open Field Editors
  const openUsernameModal = () => {
    setTempUsername(profile.username);
    setActiveModal('username');
  };

  const openGenderModal = () => {
    setTempGender(profile.gender as any);
    setActiveModal('gender');
  };

  const openBioModal = () => {
    setTempBio(profile.bio);
    setActiveModal('bio');
  };

  const openBirthdayModal = () => {
    setTempBirthday(profile.birthday || '2000-12-01');
    setActiveModal('birthday');
  };

  const openCountryModal = () => {
    setCountrySearch('');
    setActiveModal('country');
  };

  // Save Field Changes
  const applyUsername = () => {
    if (!tempUsername.trim()) {
      toast.error('Username cannot be empty');
      return;
    }
    setProfile(prev => ({ ...prev, username: tempUsername.trim() }));
    setActiveModal('none');
    toast.info('Username updated in draft');
  };

  const applyGender = (gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say') => {
    setProfile(prev => ({ ...prev, gender }));
    setActiveModal('none');
    toast.info('Gender updated in draft');
  };

  const applyBio = () => {
    setProfile(prev => ({ ...prev, bio: tempBio.trim() }));
    setActiveModal('none');
    toast.info('Bio updated in draft');
  };

  const applyBirthday = () => {
    setProfile(prev => ({ ...prev, birthday: tempBirthday }));
    setActiveModal('none');
    toast.info('Birthday updated in draft');
  };

  const applyCountry = (c: typeof COUNTRIES[0]) => {
    setProfile(prev => ({ 
      ...prev, 
      country: c.name,
      countryFlag: c.flag,
      countryCode: c.code
    }));
    setActiveModal('none');
    toast.info('Country updated in draft');
  };

  // Photo Swap / Upload Handler
  const handlePhotoSelect = (slot: number | 'avatar') => {
    setSelectedPhotoSlot(slot);
    // Stock High Resolution Portrait Assets
    const stockAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop&auto=format'
    ];
    const picked = stockAvatars[Math.floor(Math.random() * stockAvatars.length)];

    if (slot === 'avatar') {
      setProfile(prev => ({ ...prev, avatar: picked }));
      toast.success('Avatar photo updated');
    } else {
      const newPhotos = [...profile.photos];
      newPhotos[slot] = picked;
      setProfile(prev => ({ ...prev, photos: newPhotos }));
      toast.success(`Photo #${slot + 1} updated`);
    }
  };

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#0E0F17] text-white flex flex-col animate-fadeIn select-none overflow-y-auto custom-scrollbar">
      
      {/* ── 1. TOP APP BAR ── */}
      <header className="sticky top-0 z-40 px-4 py-3.5 bg-[#141622]/95 backdrop-blur-xl border-b border-slate-800/80 flex items-center justify-between shadow-md">
        <button 
          onClick={onClose}
          className="p-1 rounded-full text-slate-300 hover:text-white transition active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h1 className="text-base font-bold text-white tracking-wide">
          Edit Profile
        </h1>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="text-purple-400 hover:text-purple-300 font-bold text-base transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </header>

      {/* ── 2. MAIN SCROLLABLE CONTENT ── */}
      <main className="p-4 max-w-lg mx-auto w-full space-y-5 pb-16">
        
        {/* Amber Tip Banner (Matching Screenshot Exactly) */}
        <div className="bg-[#191508] border border-amber-500/40 rounded-xl p-3.5 flex items-start gap-3 shadow-lg">
          <div className="w-5 h-5 rounded-full border border-amber-400 flex items-center justify-center text-amber-400 font-black text-xs flex-shrink-0 mt-0.5">
            !
          </div>
          <p className="text-amber-300/90 text-xs font-semibold leading-relaxed">
            Add at least 3 photos so others can get to know you
          </p>
        </div>

        {/* Photos Showcase Section */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            
            {/* Left Big Primary Avatar Slot with Crown Frame */}
            <div className="relative aspect-square rounded-2xl bg-[#141622] border border-slate-800/80 overflow-hidden shadow-xl group">
              {/* User Avatar Image */}
              <img 
                src={profile.avatar} 
                alt="Avatar" 
                className="w-full h-full object-cover p-2 rounded-2xl" 
              />

              {/* Royal Crown Frame Graphic Layer */}
              <div className="absolute inset-0 pointer-events-none p-1 flex items-center justify-center">
                <div className="w-full h-full rounded-2xl border-4 border-purple-500/30 shadow-[inset_0_0_15px_rgba(168,85,247,0.3)] relative">
                  <div className="absolute top-1 right-1 text-xs">👑</div>
                </div>
              </div>

              {/* Camera Trigger Icon Top Right */}
              <button
                onClick={() => handlePhotoSelect('avatar')}
                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition cursor-pointer"
                title="Change Avatar"
              >
                <Camera className="w-3.5 h-3.5 text-amber-300" />
              </button>

              {/* Avatar Label Bottom Left */}
              <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[10px] text-gray-300 font-semibold border border-white/10">
                Avatar
              </div>
            </div>

            {/* Right 2x2 Showcase Photos Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {[0, 1, 2, 3].map((slotIdx) => {
                const photoUrl = profile.photos[slotIdx];
                return (
                  <div 
                    key={slotIdx}
                    onClick={() => handlePhotoSelect(slotIdx)}
                    className="relative aspect-square rounded-2xl bg-[#141622] border border-slate-800/80 overflow-hidden shadow-md group cursor-pointer hover:border-purple-500/50 transition-colors"
                  >
                    {photoUrl ? (
                      <img src={photoUrl} alt={`Slot ${slotIdx + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-1 bg-[#1A1D2D]/50">
                        <Camera className="w-5 h-5 text-gray-400" />
                        <span className="text-[10px] font-bold">Add</span>
                      </div>
                    )}

                    {/* Slot #1 Verified Blue Checkmark Badge */}
                    {slotIdx === 0 && photoUrl && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-black shadow-md border border-white/20">
                        ✓
                      </div>
                    )}

                    {/* Number Tag Bottom Left */}
                    <div className="absolute bottom-1.5 left-1.5 bg-black/75 px-2 py-0.5 rounded text-[10px] text-white font-mono font-bold border border-white/10">
                      {slotIdx + 1}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Subtext Caption */}
          <p className="text-gray-500 text-xs font-normal tracking-tight px-1 pt-1">
            Tap a photo to remove or change it. Hold and drag to reorder.
          </p>
        </div>

        {/* ── 3. FORM FIELDS CARD (Matching Screenshot Exactly) ── */}
        <div className="bg-[#141622] border border-slate-800/90 rounded-2xl divide-y divide-slate-800/60 shadow-xl overflow-hidden">
          
          {/* Username Row */}
          <div 
            onClick={openUsernameModal}
            className="p-4 flex items-center justify-between hover:bg-[#1A1D2D] transition-colors cursor-pointer group"
          >
            <span className="text-slate-300 font-medium text-sm">Username</span>
            <div className="flex items-center gap-1 text-slate-400 group-hover:text-white font-medium text-sm">
              <span>{profile.username}</span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
            </div>
          </div>

          {/* Gender Row */}
          <div 
            onClick={openGenderModal}
            className="p-4 flex items-center justify-between hover:bg-[#1A1D2D] transition-colors cursor-pointer group"
          >
            <span className="text-slate-300 font-medium text-sm">Gender</span>
            <div className="flex items-center gap-1 text-slate-400 group-hover:text-white font-medium text-sm">
              <span>{profile.gender}</span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
            </div>
          </div>

          {/* Bio Row */}
          <div 
            onClick={openBioModal}
            className="p-4 flex items-center justify-between hover:bg-[#1A1D2D] transition-colors cursor-pointer group"
          >
            <span className="text-slate-300 font-medium text-sm">Bio</span>
            <div className="flex items-center gap-1 text-slate-400 group-hover:text-white font-medium text-sm max-w-[200px] truncate">
              <span className="truncate">{profile.bio || 'Add bio'}</span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 flex-shrink-0" />
            </div>
          </div>

          {/* Birthday Row */}
          <div 
            onClick={openBirthdayModal}
            className="p-4 flex items-center justify-between hover:bg-[#1A1D2D] transition-colors cursor-pointer group"
          >
            <span className="text-slate-300 font-medium text-sm">Birthday</span>
            <div className="flex items-center gap-1 text-slate-400 group-hover:text-white font-medium text-sm">
              <span>{profile.birthday || '1-12-2000'}</span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
            </div>
          </div>

          {/* Country/Region Row */}
          <div 
            onClick={openCountryModal}
            className="p-4 flex items-center justify-between hover:bg-[#1A1D2D] transition-colors cursor-pointer group"
          >
            <span className="text-slate-300 font-medium text-sm">Country/Region</span>
            <div className="flex items-center gap-1 text-slate-400 group-hover:text-white font-medium text-sm">
              <span className="mr-1">{profile.countryFlag}</span>
              <span>{profile.country}</span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
            </div>
          </div>

        </div>

      </main>

      {/* ── 4. INTERACTIVE FIELD EDIT POPUP MODALS ── */}
      
      {/* Username Edit Modal */}
      {activeModal === 'username' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141622] border border-slate-700/80 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Edit Username</h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <input
              type="text"
              value={tempUsername}
              onChange={e => setTempUsername(e.target.value)}
              className="w-full text-sm px-4 py-3 rounded-xl bg-black/50 border border-slate-700 text-white font-medium focus:outline-none focus:border-purple-500"
              placeholder="Enter unique username"
              autoFocus
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveModal('none')}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={applyUsername}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gender Picker Modal */}
      {activeModal === 'gender' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141622] border border-slate-700/80 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Select Gender</h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2">
              {GENDERS.map(g => (
                <div
                  key={g}
                  onClick={() => applyGender(g)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    profile.gender === g ? 'bg-purple-900/40 border-purple-500 text-white' : 'bg-black/30 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-medium text-sm">{g}</span>
                  {profile.gender === g && <Check className="w-4 h-4 text-purple-400" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bio Edit Modal */}
      {activeModal === 'bio' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141622] border border-slate-700/80 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Edit Bio</h3>
              <span className="text-xs text-slate-400">{tempBio.length}/150</span>
            </div>
            
            <textarea
              rows={4}
              maxLength={150}
              value={tempBio}
              onChange={e => setTempBio(e.target.value)}
              className="w-full text-sm p-3 rounded-xl bg-black/50 border border-slate-700 text-white font-medium focus:outline-none focus:border-purple-500 leading-relaxed"
              placeholder="Tell others about yourself..."
              autoFocus
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveModal('none')}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={applyBio}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Birthday Picker Modal */}
      {activeModal === 'birthday' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141622] border border-slate-700/80 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Select Birthday</h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <input
              type="date"
              value={tempBirthday}
              max={new Date().toISOString().split('T')[0]}
              onChange={e => setTempBirthday(e.target.value)}
              className="w-full text-sm px-4 py-3 rounded-xl bg-black/50 border border-slate-700 text-white font-medium focus:outline-none focus:border-purple-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveModal('none')}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={applyBirthday}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Country Picker Modal */}
      {activeModal === 'country' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141622] border border-slate-700/80 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Select Country / Region</h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Search country..."
              value={countrySearch}
              onChange={e => setCountrySearch(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/50 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
            />

            <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1 pr-1">
              {filteredCountries.map(c => (
                <div
                  key={c.code}
                  onClick={() => applyCountry(c)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    profile.country === c.name ? 'bg-purple-900/40 border-purple-500 text-white' : 'bg-black/30 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-sm font-medium">
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </div>
                  {profile.country === c.name && <Check className="w-4 h-4 text-purple-400" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
