import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  Users,
  Shuffle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface TableGuest {
  id: string;
  name: string;
  email: string;
  dietary?: string;
}

interface SeatingTable {
  id: string;
  number: number;
  name: string;
  capacity: number;
  guests: TableGuest[];
  category: 'head' | 'family' | 'friends' | 'colleagues' | 'other';
}

const SeatingPlanManager: React.FC = () => {
  const [tables, setTables] = useState<SeatingTable[]>([
    {
      id: '1',
      number: 1,
      name: 'Head Table',
      capacity: 8,
      category: 'head',
      guests: [
        { id: '1', name: 'Tim & Kirsten', email: 'couple@wedding.com' },
        { id: '2', name: 'Best Man', email: 'bestman@email.com' },
        { id: '3', name: 'Maid of Honor', email: 'moh@email.com' },
        { id: '4', name: 'Father of Bride', email: 'father@email.com' },
        { id: '5', name: 'Mother of Bride', email: 'mother@email.com' },
        { id: '6', name: 'Father of Groom', email: 'fatherg@email.com' },
        { id: '7', name: 'Mother of Groom', email: 'motherg@email.com' },
        { id: '8', name: 'Celebrant', email: 'celebrant@email.com' }
      ]
    },
    {
      id: '2',
      number: 2,
      name: 'Family Table',
      capacity: 10,
      category: 'family',
      guests: [
        { id: '9', name: 'Grandma Smith', email: 'grandma@email.com' },
        { id: '10', name: 'Grandpa Smith', email: 'grandpa@email.com' },
        { id: '11', name: 'Uncle John', email: 'uncle@email.com' },
        { id: '12', name: 'Aunt Mary', email: 'aunt@email.com' },
        { id: '13', name: 'Cousin Sarah', email: 'cousin@email.com' },
        { id: '14', name: 'Cousin Mike', email: 'cousint@email.com' },
        { id: '15', name: 'Sister Emma', email: 'sister@email.com' },
        { id: '16', name: 'Brother Tom', email: 'brother@email.com' },
        { id: '17', name: 'Nephew Billy', email: 'nephew@email.com' },
        { id: '18', name: 'Niece Sophie', email: 'niece@email.com' }
      ]
    },
    {
      id: '3',
      number: 3,
      name: 'College Friends',
      capacity: 10,
      category: 'friends',
      guests: [
        { id: '19', name: 'Alex Johnson', email: 'alex@email.com' },
        { id: '20', name: 'Jamie Wilson', email: 'jamie@email.com' },
        { id: '21', name: 'Chris Brown', email: 'chris@email.com' },
        { id: '22', name: 'Taylor Davis', email: 'taylor@email.com' },
        { id: '23', name: 'Morgan Lee', email: 'morgan@email.com' },
        { id: '24', name: 'Jordan Kim', email: 'jordan@email.com' },
        { id: '25', name: 'Casey Park', email: 'casey@email.com' }
      ]
    },
    {
      id: '4',
      number: 4,
      name: 'Work Colleagues',
      capacity: 8,
      category: 'colleagues',
      guests: [
        { id: '26', name: 'Lisa Manager', email: 'lisa@work.com' },
        { id: '27', name: 'Bob Colleague', email: 'bob@work.com' },
        { id: '28', name: 'Anna Team', email: 'anna@work.com' },
        { id: '29', name: 'Dave Project', email: 'dave@work.com' }
      ]
    }
  ]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'head': return 'bg-wedding-gold text-black';
      case 'family': return 'bg-wedding-purple text-white';
      case 'friends': return 'bg-green-500 text-white';
      case 'colleagues': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'head': return '👑';
      case 'family': return '👨‍👩‍👧‍👦';
      case 'friends': return '👥';
      case 'colleagues': return '💼';
      default: return '🪑';
    }
  };

  const totalSeated = tables.reduce((sum, table) => sum + table.guests.length, 0);
  const totalCapacity = tables.reduce((sum, table) => sum + table.capacity, 0);
  const unassignedGuests = 45; // This would come from actual guest list

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Seating Plan Management</h2>
          <p className="text-muted-foreground">
            Organize your wedding reception seating arrangements
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Shuffle className="w-4 h-4 mr-2" />
            Auto-Arrange
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Table
          </Button>
        </div>
      </div>

      {/* Seating Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-wedding-purple">{tables.length}</div>
            <div className="text-sm text-muted-foreground">Total Tables</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-500">{totalSeated}</div>
            <div className="text-sm text-muted-foreground">Guests Seated</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-500">{totalCapacity}</div>
            <div className="text-sm text-muted-foreground">Total Capacity</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-500">{unassignedGuests}</div>
            <div className="text-sm text-muted-foreground">Unassigned</div>
          </CardContent>
        </Card>
      </div>

      {/* Seating Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Reception Seating Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tables.map((table) => (
              <Card 
                key={table.id} 
                className="relative hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryIcon(table.category)}</span>
                      <div>
                        <CardTitle className="text-lg">Table {table.number}</CardTitle>
                        <p className="text-sm text-muted-foreground">{table.name}</p>
                      </div>
                    </div>
                    <Badge className={getCategoryColor(table.category)}>
                      {table.category}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Capacity:</span>
                      <span className="font-medium">
                        {table.guests.length} / {table.capacity}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Guests:</p>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {table.guests.map((guest) => (
                          <div 
                            key={guest.id}
                            className="text-xs p-2 bg-gray-50 rounded flex items-center justify-between"
                          >
                            <span>{guest.name}</span>
                            {guest.dietary && (
                              <Badge variant="outline" className="text-xs">
                                {guest.dietary}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      {table.category !== 'head' && (
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add New Table Card */}
            <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                <Plus className="w-12 h-12 text-gray-400 mb-4" />
                <h4 className="font-medium text-gray-600 mb-2">Add New Table</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Create a new seating arrangement
                </p>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Table
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Unassigned Guests */}
      {unassignedGuests > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Users className="w-5 h-5" />
              Unassigned Guests ({unassignedGuests})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              These guests haven't been assigned to a table yet. Drag and drop them to assign seating.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {/* This would be populated with actual unassigned guests */}
              <div className="p-2 border rounded text-sm">John Doe +1</div>
              <div className="p-2 border rounded text-sm">Sarah Miller</div>
              <div className="p-2 border rounded text-sm">Robert Johnson +1</div>
              {/* ... more unassigned guests */}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SeatingPlanManager;