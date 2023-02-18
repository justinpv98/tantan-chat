import { styled } from "@/stitches.config";

const Image = styled('img', {
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    variants: {
        fit: {
            contain: {
               objectFit: "contain"
            },
            cover: {
                objectFit: "cover"
            },
            none: {
                objectFit: "none"
            }
        },
        round: {
            true: {
                borderRadius: "$round"
            },
            false: {}
        }
    },

    defaultVariants: {
        fit: "cover"
    }
})

export default Image;