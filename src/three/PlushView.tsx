import { View } from '@react-three/drei';
import { KawaiiFood } from '../assets/KawaiiFood';
import { PlushScene, type PlushProps } from './PlushFriend';
import { PLUSH } from './plushSpecs';

export default function PlushView({ size, ...props }: PlushProps & { size: number }) {
  if (!PLUSH[props.id]) return <KawaiiFood id={props.id} mood={props.mood} size={size} />;
  return (
    <span className="plush-slot" style={{ width: size, height: size }} aria-hidden>
      <View className="plush-view" style={{ width: size * 1.2, height: size * 1.2 }}>
        <PlushScene {...props} />
      </View>
    </span>
  );
}
