import { cn } from "@/lib/utils";
import * as Slider from "@radix-ui/react-slider";

const SliderRoot = ({
  className,
  ...props
}: React.ComponentProps<typeof Slider.Root>) => (
  <Slider.Root
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  />
);
SliderRoot.displayName = "SliderRoot";

const SliderTrack = ({
  className,
  ...props
}: React.ComponentProps<typeof Slider.Track>) => (
  <Slider.Track
    className={cn(
      "relative h-2 w-full grow overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  />
);
SliderTrack.displayName = "SliderTrack";

const SliderRange = ({
  className,
  ...props
}: React.ComponentProps<typeof Slider.Range>) => (
  <Slider.Range
    className={cn("absolute h-full bg-primary", className)}
    {...props}
  />
);
SliderRange.displayName = "SliderRange";

const SliderThumb = ({
  className,
  ...props
}: React.ComponentProps<typeof Slider.Thumb>) => (
  <Slider.Thumb
    className={cn(
      "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
);
SliderThumb.displayName = "SliderThumb";

export { SliderRoot as Slider, SliderRange, SliderThumb, SliderTrack };
