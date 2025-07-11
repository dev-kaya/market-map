# How to Endorse Companies

The Market Map includes a community endorsement feature that allows users to tag companies with positive attributes.

## Features

### 🏷️ **Tag System**
Users can endorse companies with one of five tags:
- **Great Team** - Exceptional leadership and talent
- **Strong Tech** - Impressive technical capabilities  
- **Fast Growth** - Rapidly scaling business
- **Market Leader** - Leading position in their sector
- **Other** - Other positive qualities

### 🎯 **One Endorsement Per Company**
- Each user can endorse a company exactly once
- Users can change their tag choice (updates existing endorsement)
- Once endorsed, the tag selection is disabled for that company

### 📊 **Visual Feedback**
- **Tag Bar**: Companies with endorsements display a horizontal bar showing the top 3 most popular tags
- **Count Display**: Shows total number of endorsements
- **Real-time Updates**: Optimistic UI updates with 250ms skeleton shimmer during loading

## How to Use

### **Step 1: Click "Endorse Company"**
On any company card, click the "Endorse Company" button at the bottom.

### **Step 2: Choose Your Tag**
A modal will appear with 5 tag options. Click on the tag that best describes the company.

### **Step 3: View Results**
- Your endorsement is saved immediately
- The modal shows your selection with a checkmark
- The company card updates to show the new endorsement data
- Other users will see your contribution in the community tags

### **Already Endorsed?**
- If you've already endorsed a company, the button changes to "View Endorsements"
- Click to see the current endorsement breakdown
- Your previous choice is highlighted and cannot be changed

## Technical Implementation

### **API Endpoints**
```
POST /api/endorse
- Body: { companyId: string, tag: TagLabel }
- Creates or updates user's endorsement
- Requires JWT authentication

GET /api/endorse/:companyId  
- Returns: { counts: EndorsementCounts, userTag: TagLabel | null }
- Shows all endorsement data for a company
- Requires JWT authentication
```

### **Database Schema**
```sql
model Endorsement {
  id        String   @id @default(cuid())
  userId    String
  companyId String  
  tag       String   -- GREAT_TEAM, STRONG_TECH, etc.
  createdAt DateTime @default(now())
  
  @@unique([userId, companyId]) -- One per user per company
}
```

### **React Integration**
- `useEndorsements(companyId)` hook with TanStack Query
- Optimistic updates for immediate UI feedback
- Automatic error rollback if endorsement fails
- 30-second cache with background refetching

## Development

### **Running Tests**
```bash
npm run test endorsements
```

### **Seeding Sample Data**
The seed script automatically creates 0-3 random endorsements per company:
```bash
npm run seed
```

### **Authentication**
Currently uses mock JWT tokens. In production, integrate with your authentication system by updating:
- `getUserIdFromAuth()` in API routes
- `MOCK_AUTH_TOKEN` in the useEndorsements hook

## Future Enhancements

- **User Profiles**: Show who endorsed each company
- **Endorsement History**: Track endorsement trends over time
- **Company Rankings**: Sort companies by endorsement scores
- **Tag Analytics**: Popular tags by sector/country
- **Social Features**: Follow other users' endorsements