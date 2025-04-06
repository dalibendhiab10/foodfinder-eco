import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, Gift, ChevronRight, Loader2 } from 'lucide-react';

interface UserProfile {
  ecoPoints: number;
  ecoLevel: string; // Assuming ecoLevel might be used later
}

interface EcoImpactCardProps {
  userProfile: UserProfile | null;
  loading: boolean;
}

const EcoImpactCard = ({ userProfile, loading }: EcoImpactCardProps) => {
  return (
    <Card className="shadow-lg mb-6">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">Eco Impact</h3>
          <Award size={20} className="text-eco-500" />
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-eco-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-eco-50 rounded-lg">
                {/* Placeholder Data - Consider fetching real data */}
                <p className="text-3xl font-bold text-eco-600">0</p>
                <p className="text-sm text-muted-foreground">kg food saved</p>
              </div>
              <div className="text-center p-3 bg-eco-50 rounded-lg">
                {/* Placeholder Data - Consider fetching real data */}
                <p className="text-3xl font-bold text-eco-600">0</p>
                <p className="text-sm text-muted-foreground">kg CO₂ reduced</p>
              </div>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Eco Points</span>
                <span className="font-medium">{userProfile?.ecoPoints || 0}</span>
              </div>
              <Progress value={userProfile?.ecoPoints ? Math.min(userProfile.ecoPoints / 100, 100) : 0} className="h-2 bg-eco-100" />
            </div>

            <p className="text-xs text-muted-foreground mb-3">
              Earn points to reach the next level!
            </p>
          </>
        )}

        <Link to="/loyalty">
          <Button className="w-full flex justify-between bg-eco-500 hover:bg-eco-600">
            <span className="flex items-center gap-2">
              <Gift size={16} />
              Loyalty Program & Rewards
            </span>
            <ChevronRight size={16} />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default EcoImpactCard;