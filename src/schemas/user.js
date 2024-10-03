import { update } from "lodash";
import * as yup from "yup";


const schema = {
    create: {
        body: yup
            .object({
                name: yup.string().required(),
                email: yup.string().email().required(),
                password: yup.string().required(),
            })
            .noUnknown(),
    },
    find: {
        params: yup.object({
        }),
    },
    login: {
        body: yup
            .object({
                email: yup.string().email().required(),
                password: yup.string().required(),
            })
            .noUnknown(),
    },
    updatePassword: {
        body: yup
            .object({
                currentPassword: yup.string().required(),
                newPassword: yup.string().required(),
            })
            .noUnknown(),
    },
    getProfile: {
        params: yup.object({
        }),
    },
    update: {
        body: yup
            .object({
                name: yup.string(),
                email: yup.string().email(),
            })
            .noUnknown()
            .test('at-least-one', 'You must provide at least one field to update', value => {
                return value.name || value.email;
            }),
    }
    
};


export default {
    login: schema.login,
    remove: schema.find,
    create: schema.create,
    update: schema.update,
    updatePassword: schema.updatePassword,
    getProfile: schema.getProfile,
};