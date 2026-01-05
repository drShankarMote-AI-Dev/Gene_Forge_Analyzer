import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { getReadingFrames, getBaseClass } from '@/utils/dnaUtils';

interface ReadingFramesProps {
  sequence: string;
}

const ReadingFrames: React.FC<ReadingFramesProps> = ({ sequence }) => {
  const [frames, setFrames] = useState<Array<Array<{ codon: string, aminoAcid: string }>>>([]);

  useEffect(() => {
    if (sequence) {
      setFrames(getReadingFrames(sequence));
    }
  }, [sequence]);

  const frameLabels = ['+1', '+2', '+3', '-1', '-2', '-3'];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Reading Frames Translation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Tabs defaultValue="frame0" className="w-full">
            <TabsList className="grid grid-cols-6">
              {frameLabels.map((label, index) => (
                <TabsTrigger key={index} value={`frame${index}`}>
                  Frame {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {frames.map((frame, frameIndex) => (
              <TabsContent key={frameIndex} value={`frame${frameIndex}`} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    Frame {frameLabels[frameIndex]}
                    {frameIndex >= 3 ? " (Reverse Complement)" : ""}
                  </h3>
                  <Badge variant="outline">{frame.length} codons</Badge>
                </div>

                <ScrollArea className="h-60 border rounded-md p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {frame.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 p-1 border rounded">
                        <Badge variant="outline" className="font-mono w-16 text-center py-1">
                          {item.codon.split('').map((base, i) => (
                            <span key={i} className={getBaseClass(base)}>{base}</span>
                          ))}
                        </Badge>
                        <span className={item.aminoAcid === 'Stop' ? 'text-red-500 font-bold' : 'text-sm'}>
                          {item.aminoAcid}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm font-medium">Amino Acid Sequence:</p>
                  <p className="font-mono break-all mt-2">
                    {frame.map(item =>
                      item.aminoAcid === 'Stop' ? '*' :
                        item.aminoAcid.charAt(0)
                    ).join('')}
                  </p>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadingFrames;
