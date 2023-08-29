'''



import json

def read_spectrumModel():
    with open('data/spectrumModel.json') as stream:
        SpectrumModels = json.load(stream)
    return SpectrumModels

def read_stateVlCascade():
    with open('data/vlcascadestate.json') as stream:
        statevlcascade = json.load(stream)
    return statevlcascade
def read_lgaVlCascade():
    with open('data/vlcascadebylga.json') as stream:
        lgavlcascade =json.load(stream)
    return lgavlcascade

def read_txNewByWeek():
    with open('data/txNewByWeek.json') as stream:
        txnewWeekly= json.load(stream)
    return txnewWeekly

def read_numToReach():
    return 14034

def read_quaterPosToLinkage():
    with open("data/linkage.json") as stream:
        quarterpostolinkage =json.load(stream)
    return quarterpostolinkage
'''




import json

def read_json_file(file_path):
    with open(file_path) as stream:
        data = json.load(stream)
    return data

def read_spectrum_model():
    return read_json_file('data/spectrumModel.json')

def read_state_vl_cascade():
    return read_json_file('data/vlcascadestate.json')

def read_lga_vl_cascade():
    return read_json_file('data/vlcascadebylga.json')

def read_tx_new_by_week():
    return read_json_file('data/txNewByWeek.json')

def read_num_to_reach():
    return 14034

def read_quater_pos_to_linkage():
    return read_json_file('data/linkage.json')
def read_abia_map():
    return read_json_file('data/abia_map_data.json')

